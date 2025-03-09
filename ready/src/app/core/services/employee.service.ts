import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StorageKeys } from '../storage-keys';

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
  gender: string;
  education: string;
  company: string;
  experience: string;
  salary: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor() {}

  getEmployees(): Observable<Employee[]> {
    const employees = this.getEmployeesFromLocalStorage();
    return of(employees);
  }

  // Получение сотрудника по ID
  getEmployeeById(id: number): Observable<Employee | undefined> {
    const employees = this.getEmployeesFromLocalStorage();
    const employee = employees.find(emp => emp.id === id);
    return of(employee);
  }

  // Создание нового сотрудника
  createEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    const employees = this.getEmployeesFromLocalStorage();
    const newEmployee: Employee = {
      id: this.generateId(employees),
      ...employee,
    };
    employees.push(newEmployee);
    this.saveEmployeesToLocalStorage(employees);
    return of(newEmployee);
  }

  // Редактирование сотрудника
  updateEmployee(updatedEmployee: Employee): Observable<Employee> {
    const employees = this.getEmployeesFromLocalStorage();
    const index = employees.findIndex(emp => emp.id === updatedEmployee.id);
    if (index !== -1) {
      employees[index] = updatedEmployee;
      this.saveEmployeesToLocalStorage(employees);
    }
    return of(updatedEmployee);
  }

  // Удаление сотрудника
  deleteEmployee(id: number): Observable<void> {
    const employees = this.getEmployeesFromLocalStorage();
    const updatedEmployees = employees.filter(emp => emp.id !== id);
    this.saveEmployeesToLocalStorage(updatedEmployees);
    return of(void 0);
  }

  // Получение списка сотрудников из localStorage
  private getEmployeesFromLocalStorage(): Employee[] {
    const employeesJson = localStorage.getItem(StorageKeys.EMPLOYEES);
    return employeesJson ? JSON.parse(employeesJson) : [];
  }

  // Сохранение списка сотрудников в localStorage
  private saveEmployeesToLocalStorage(employees: Employee[]): void {
    localStorage.setItem(StorageKeys.EMPLOYEES, JSON.stringify(employees));
  }

  // Генерация уникального ID для нового сотрудника
  private generateId(employees: Employee[]): number {
    return employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1;
  }
}

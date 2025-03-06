// admin.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmpAddEditComponent } from '../emp-add-edit/emp-add-edit.component';
import { EmployeeService } from '../services/employee.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from '../core/core.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Добавили HttpClient

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  loggedUser: any;
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'dob',
    'gender',
    'education',
    'company',
    'experience',
    'package',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;
  logs: Array<any> = []; // Здесь будут храниться все действия пользователя

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _empService: EmployeeService,
    private _coreService: CoreService,
    private _router: Router,
    private http: HttpClient // Добавили HttpClient
  ) {
    const localUser = localStorage.getItem('loggedUser');
    if (localUser != null) {
      this.loggedUser = JSON.parse(localUser);
    }
  }

  onLogOut() {
    localStorage.removeItem('loggedUser');
    this._router.navigateByUrl('/loginsignup');
  }

  ngOnInit(): void {
    this.getEmployeeList();
    this.getActionLogs(); // Загружаем историю действий
  }

  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(EmpAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList();
          this.saveAction('добавил нового сотрудника'); // Сохраняем действие
        }
      },
    });
  }

  getEmployeeList() {
    this._empService.getEmployeeList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(id: number) {
    this._empService.deleteEmployee(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Employee deleted!', 'done');
        this.getEmployeeList();
        this.saveAction(`удалил сотрудника с id=${id}`); // Сохраняем действие
      },
      error: console.log,
    });
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(EmpAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList();
          this.saveAction(`отредактировал сотрудника с id=${data.id}`); // Сохраняем действие
        }
      },
    });
  }

  // Получение всех действий из базы данных
  getActionLogs() {
    this.http.get<any[]>('http://localhost:3000/action_logs').subscribe(logs => {
      this.logs = logs;
    });
  }

  // Сохранение нового действия в базу данных
  saveAction(action: string) {
    this.http.post('http://localhost:3000/action_logs', {
      userName: this.loggedUser?.name || '',
      action
    }).subscribe(() => {
      this.getActionLogs(); // Перезагрузить журнал действий
    });
  }
}
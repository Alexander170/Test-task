import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService, Employee, EmployeeDialogComponent, EmployeeService, LoggingService } from '../../core';
import { Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  loggedUser: any;

  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'birthday',
    'gender',
    'education',
    'company',
    'experience',
    'salary',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private employeeService: EmployeeService,
    private router: Router,
    private loggingService: LoggingService,
  ) {
    const localUser = localStorage.getItem('loggedUser');
    if (localUser != null) {
      this.loggedUser = JSON.parse(localUser);
    }
  }

  ngOnInit(): void {
    this.getEmployeeList();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openAddEmployeeForm() {
    this.dialog.open(EmployeeDialogComponent, {
      data: {
        onConfirm: (value: Employee) => this.employeeService.createEmployee(value).pipe(
          tap(() => {
            this.loggingService.createLog({ // Логирование создания нового сотрудника
              userId: this.loggedUser.login,
              action: 'создал',
            });
            this.getEmployeeList()
          }),
        ),
      },
    });
  }

  getEmployeeList(): void {
    this.subscription.add(
      this.employeeService
        .getEmployees()
        .pipe(
          tap(list => {
            this.dataSource = new MatTableDataSource<Employee>(list);
            this.dataSource.sort = this.sort;
          }),
        )
        .subscribe(),
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(id: number) {
    this.subscription.add(
        this.employeeService
            .deleteEmployee(id)
            .pipe(
                tap(() => {
                    this.loggingService.createLog({ // Логирование удаления сотрудника
                        userId: this.loggedUser.login,
                        action: 'удалил',
                    });
                    this.getEmployeeList()
                }),
            )
            .subscribe(),
    );
}

  openEditForm(data: Employee) {
    this.dialog.open(EmployeeDialogComponent, {
      data: {
        onConfirm: (value: Employee) =>
          this.employeeService
            .updateEmployee({
              ...value,
              id: data.id,
            })
            .pipe(tap(() => {
                this.loggingService.createLog({ // Логирование удаления сотрудника
                    userId: this.loggedUser.login,
                    action: 'обновил',
                }); 
              this.getEmployeeList()})),
        data,
      },
    });
  }

  log(){
    this.router.navigate(['/log']);
  }

  logout(): void {
    this.subscription.add(
      this.authService
        .logout()
        .pipe(
          tap(v => {
            this.router.navigate(['/login']);
          }),
        )
        .subscribe(),
    );
  }
}

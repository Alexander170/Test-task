import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  activeForm: 'login' | 'register' = 'login';
  registerObj: registerModel = new registerModel();
  loginObj: loginModel = new loginModel();

  constructor(private _snackbar: MatSnackBar, private _router: Router) {}

  toggleForm(form: 'login' | 'register') {
    this.activeForm = form;
  }

  registerForm() {
    debugger;
    const localusers = localStorage.getItem('users');
    if (localusers != null) {
      const users = JSON.parse(localusers);
      users.push(this.registerObj);
      localStorage.setItem('users', JSON.stringify(users));
    } else {
      const users = [];
      users.push(this.registerObj);
      localStorage.setItem('users', JSON.stringify(users));
    }
    this._snackbar.open('Пользователь успешно зарегестрирован', 'Закрыть');
  }
  loginForm() {
    debugger;
    const localusers = localStorage.getItem('users');
    if (localusers != null) {
      const users = JSON.parse(localusers);
      const isUserExist = users.find(
        (user: registerModel) =>
          user.email == this.loginObj.email &&
          user.password == this.loginObj.password
      );
      if (isUserExist != undefined) {
        this._snackbar.open('Успешный вход', 'Закрыть');
        localStorage.setItem('loggedUser', JSON.stringify(isUserExist));
        this._router.navigateByUrl('/main');
      } else {
        this._snackbar.open('Эл.почта или пароль введены неверно!');
      }
    }
  }
}
export class registerModel {
  name: string;
  email: string;
  password: string;
  constructor() {
    this.name = '';
    this.email = '';
    this.password = '';
  }
}
export class loginModel {
  email: string;
  password: string;
  constructor() {
    this.email = '';
    this.password = '';
  }
}

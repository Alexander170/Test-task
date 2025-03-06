import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  activeForm: 'login' | 'register' = 'login';
  registerObj: RegisterModel = { name: '', email: '', password: '' };
  loginObj: LoginModel = { email: '', password: '' }; 

  errorEmailRegister: boolean = false;
  errorNameRegister: boolean = false;
  errorPasswordRegister: boolean = false;
  errorEmailLogin: boolean = false;
  errorPasswordLogin: boolean = false;

  constructor(private snackbar: MatSnackBar, private router: Router) {}

  ngOnInit(): void {}

  toggleForm(form: 'login' | 'register') {
    this.activeForm = form;
  }

  registerForm() {
    this.errorEmailRegister = false;
    this.errorNameRegister = false;
    this.errorPasswordRegister = false;

    if (!this.registerObj.name || this.registerObj.name.trim().length === 0) {
      this.errorNameRegister = true;
      return;
    }

    if (!this.validateEmail(this.registerObj.email)) {
      this.errorEmailRegister = true;
      return;
    }

    if (!this.registerObj.password || this.registerObj.password.length < 6) {
      this.errorPasswordRegister = true;
      return;
    }

    const localUsers = localStorage.getItem('users');
    if (localUsers != null) {
      const users = JSON.parse(localUsers);
      users.push(this.registerObj);
      localStorage.setItem('users', JSON.stringify(users));
    } else {
      const users = [];
      users.push(this.registerObj);
      localStorage.setItem('users', JSON.stringify(users));
    }
    this.snackbar.open('Пользователь успешно зарегистрирован', 'Закрыть');
  }

  loginForm() {
    this.errorEmailLogin = false;
    this.errorPasswordLogin = false;

    if (!this.validateEmail(this.loginObj.email)) {
      this.errorEmailLogin = true;
      return;
    }

    if (!this.loginObj.password || this.loginObj.password.length < 6) {
      this.errorPasswordLogin = true;
      return;
    }

    const localUsers = localStorage.getItem('users');
    if (localUsers != null) {
      const users = JSON.parse(localUsers);
      const isUserExist = users.find(
        (user: RegisterModel) =>
          user.email === this.loginObj.email && user.password === this.loginObj.password
      );
      if (isUserExist) {
        this.snackbar.open('Успешный вход', 'Закрыть');
        localStorage.setItem('loggedUser', JSON.stringify(isUserExist));
        this.router.navigateByUrl('/main');
      } else {
        this.snackbar.open('Электронная почта или пароль введены неверно!', 'Закрыть');
      }
    }
  }

  validateEmail(email: string): boolean {
    const re = /^(([^<>()[$$\\.,;:\s@"]+(\.[^<>()[$$\\.,;:\s@"]+)*)|(".+"))@(($$[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$$)|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}

interface RegisterModel {
  name: string;
  email: string;
  password: string;
}

interface LoginModel {
  email: string;
  password: string;
}
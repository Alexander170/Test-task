// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedIn = false;

  constructor(private router: Router) {}

  login(user: any) {
    this.isLoggedIn = true;
    localStorage.setItem('loggedUser', JSON.stringify(user)); // Сохранение пользователя в Local Storage
    this.router.navigateByUrl('/main'); // Переход на главную страницу
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('loggedUser');
    this.router.navigateByUrl('/login');
  }

  getIsAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  getCurrentUser(): any {
    const loggedUser = localStorage.getItem('loggedUser');
    return loggedUser ? JSON.parse(loggedUser) : null; // Проверка на null перед парсингом
  }
}
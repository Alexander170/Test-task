import { Injectable } from '@angular/core';
import { User, UserService } from './user.service';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { StorageKeys } from '../storage-keys';

export interface LoginRequest {
  login: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  login: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly userService: UserService) {}

  login(data: LoginRequest): Observable<User> {
    return this.userService.getUserList().pipe(
      map((users: User[]) => {
        const user = users.find(user => user.login === data.login && user.password === data.password);

        if (!user) {
          throw new Error('Введены неверные данные');
        }

        localStorage.setItem(StorageKeys.LOGGED_USER, JSON.stringify(user));
        return user;
      }),
      catchError(error => throwError(() => error)),
    );
  }

  signUp(data: SignupRequest): Observable<User> {
    return this.userService.addUser(data);
  }

  logout(): Observable<boolean> {
    localStorage.removeItem(StorageKeys.LOGGED_USER);

    return of(true);
  }

  get isAuthenticated(): boolean {
    return !!localStorage.getItem(StorageKeys.LOGGED_USER);
  }
}

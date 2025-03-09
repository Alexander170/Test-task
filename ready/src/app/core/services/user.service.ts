import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import {StorageKeys} from "../storage-keys";

export interface User {
  id: number;
  email: string;
  login: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  getUserList(): Observable<User[]> {
    const usersString = localStorage.getItem(StorageKeys.USERS);

    return of(usersString ? JSON.parse(usersString) : []);
  }

  addUser(data: Omit<User, 'id'>): Observable<User> {
    return this.getUserList().pipe(
      map(users => {
        const emailExists = users.some(user => user.email === data.email);
        const loginExists = users.some(user => user.login === data.login);
        if (emailExists) {
          throw new Error('Пользователь с таким email уже существует!');
        } else if (loginExists) {
          throw new Error('Пользователь с таким логином уже существует!');
        } else {
          const newUser: User = {
            ...data,
            id: this.generateId(users),
          };
          users.push(newUser);
          localStorage.setItem(StorageKeys.USERS, JSON.stringify(users));
          return newUser;
        }
      }),
      catchError(error => throwError(() => error)),
    );
  }

  private generateId(users: User[]): number {
    return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  }
}

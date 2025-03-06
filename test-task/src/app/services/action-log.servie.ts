// action-log.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionLogService {
  constructor(private http: HttpClient) {}

  // Метод для получения всех действий из базы данных
  getActionLogs(): Observable<any[]> {
    return this.http.get<any[]>('/api/action_logs'); // Предполагаемый endpoint
  }

  // Метод для сохранения нового действия в базу данных
  saveAction(action: string, userName: string): Observable<any> {
    return this.http.post('/api/action_logs', { action, userName }); // Предполагаемый endpoint
  }
}
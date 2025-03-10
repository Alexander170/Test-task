// logging.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { StorageKeys } from '../storage-keys';

@Injectable({
    providedIn: 'root',
})
export class LoggingService {
    constructor() {}

    // Получение всех логов
    getLogs(): Observable<LogEntry[]> {
      const logs = this.getLogsFromLocalStorage();
      return of(logs);
    }
  
    // Получение логов по userId
    getLogsByUserId(userId: string): Observable<LogEntry[]> {
      const logs = this.getLogsFromLocalStorage();
      const userLogs = logs.filter(log => log.userId === userId);
      return of(userLogs);
    }
  
    // Создание нового лога
    createLog(log: Omit<LogEntry, 'timestamp'>): Observable<LogEntry> {
      const logs = this.getLogsFromLocalStorage();
      const newLog: LogEntry = {
        ...log,
        timestamp: new Date(), // Добавляем текущую дату и время
      };
      logs.push(newLog);
      this.saveLogsToLocalStorage(logs);
      return of(newLog);
    }
  
    // Удаление логов по userId
    deleteLogsByUserId(userId: string): Observable<void> {
      const logs = this.getLogsFromLocalStorage();
      const updatedLogs = logs.filter(log => log.userId !== userId);
      this.saveLogsToLocalStorage(updatedLogs);
      return of(void 0);
    }
  
    // Очистка всех логов
    clearLogs(): Observable<void> {
      localStorage.removeItem(StorageKeys.LOGS);
      return of(void 0);
    }
  
    // Получение списка логов из localStorage
    private getLogsFromLocalStorage(): LogEntry[] {
      const logsJson = localStorage.getItem(StorageKeys.LOGS);
      return logsJson ? JSON.parse(logsJson) : [];
    }
  
    // Сохранение списка логов в localStorage
    private saveLogsToLocalStorage(logs: LogEntry[]): void {
      localStorage.setItem(StorageKeys.LOGS, JSON.stringify(logs));
    }
  
}

export interface LogEntry {
  userId: string;
  action: 'создал' | 'обновил' | 'удалил';
  timestamp: Date;
}
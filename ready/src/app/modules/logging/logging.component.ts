import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LogEntry, LoggingService } from '../../core';
import { Subscription, tap } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-viewer',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.scss']
})
export class LogViewerComponent implements OnInit, OnDestroy {
  logs$:any
  private readonly subscription = new Subscription();
  constructor(
    public loggingService: LoggingService,
    private router: Router
  ) {
    
  }
  displayedColumns: string[] = [
    'userId',
    'timestamp',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getLogs();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  main(){
    this.router.navigate(['/main']);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getLogs(): void {
    this.subscription.add(
          this.loggingService
            .getLogs()
            .pipe(
              tap(list => {
                this.dataSource = new MatTableDataSource<LogEntry>(list);
                this.dataSource.sort = this.sort;
                console.log(this.dataSource)
              }),
            )
            .subscribe(),
        ); 
  }
  
}
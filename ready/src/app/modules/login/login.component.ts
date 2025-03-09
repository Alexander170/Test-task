import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { catchError, tap, throwError } from 'rxjs';
import { AuthService } from '../../core';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  error: string | undefined = undefined;

  form = new UntypedFormGroup({
    login: new UntypedFormControl('', Validators.required),
    password: new UntypedFormControl('', Validators.required),
  });

  constructor(
    private router: Router,
    private readonly authService: AuthService,
  ) {}

  get loginControl(): UntypedFormControl {
    return this.form.get('login') as UntypedFormControl;
  }

  get passwordControl(): UntypedFormControl {
    return this.form.get('password') as UntypedFormControl;
  }

  submit(): void {
    this.error = undefined;
    if (this.form.valid) {
      this.authService
        .login(this.form.value)
        .pipe(
          tap(() => this.router.navigate(['/main'])),
          catchError(err => {
            this.error = err.message;
            return throwError(() => err);
          }),
        )
        .subscribe();
    }
  }
}

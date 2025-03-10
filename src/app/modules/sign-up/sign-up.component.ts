import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { catchError, tap, throwError } from 'rxjs';
import { AuthService } from '../../core';

@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  error: string | undefined = undefined;

  form = new UntypedFormGroup({
    login: new UntypedFormControl('', Validators.required),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    password: new UntypedFormControl('', Validators.required),
  });

  constructor(
    private snackbar: MatSnackBar,
    private readonly authService: AuthService,
  ) {}

  get loginControl(): UntypedFormControl {
    return this.form.get('login') as UntypedFormControl;
  }

  get passwordControl(): UntypedFormControl {
    return this.form.get('password') as UntypedFormControl;
  }

  get emailControl(): UntypedFormControl {
    return this.form.get('email') as UntypedFormControl;
  }

  submit(): void {
    this.error = undefined;

    if (this.form.valid) {
      this.authService
        .signUp(this.form.value)
        .pipe(
          tap(() => this.snackbar.open('Пользователь успешно создан', 'OK', { verticalPosition: 'top', duration: 2000 })),
          catchError(err => {
            this.error = err.message;
            return throwError(() => err);
          }),
        )
        .subscribe();
    }
  }
}

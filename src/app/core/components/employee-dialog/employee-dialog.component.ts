import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Employee } from '../../services';
import { Observable } from 'rxjs';

interface Education {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee-dialog.component.html',
  styleUrls: ['./employee-dialog.component.scss'],
})
export class EmployeeDialogComponent implements OnInit {
  form = new UntypedFormGroup({
    firstName: new UntypedFormControl('', [Validators.required]),
    lastName: new UntypedFormControl('', [Validators.required]),
    email: new UntypedFormControl('', [Validators.required]),
    birthday: new UntypedFormControl('', [Validators.required]),
    gender: new UntypedFormControl('', [Validators.required]),
    education: new UntypedFormControl('', [Validators.required]),
    company: new UntypedFormControl('', [Validators.required]),
    experience: new UntypedFormControl('', [Validators.required]),
    salary: new UntypedFormControl('', [Validators.required]),
  });

  educations: Education[] = [
    { value: 'Среднее', viewValue: 'Среднее' },
    { value: 'Среднее полное', viewValue: 'Среднее полное' },
    { value: 'Среднее специальное', viewValue: 'Среднее специальное' },
    { value: 'Высшее', viewValue: 'Высшее' },
    { value: 'Магистр', viewValue: 'Магистр' },
  ];

  constructor(
    private dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      data: Employee | undefined;
      onConfirm: (data: Employee) => Observable<void>;
    },
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.data) {
      const { id, ...formData } = this.data.data;
      this.form.setValue(formData);
    }
  }

  onFormSubmit() {
    if (this.form.valid) {
      this.data.onConfirm(this.form.value).subscribe(() => this.close());
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}

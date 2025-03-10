import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeDialogComponent } from './employee-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormField, MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import { MatDatepicker, MatDatepickerInput, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@NgModule({
  declarations: [EmployeeDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatRadioGroup,
    MatLabel,
    MatRadioButton,
    MatSelect,
    MatOption,
    MatDialogContent,
    MatInput,
    MatDialogActions,
    MatButton,
    MatDialogTitle,
    MatHint,
    MatError,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
})
export class EmployeeDialogModule {}

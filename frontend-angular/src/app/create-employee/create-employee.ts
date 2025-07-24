import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

import { Employee } from '../employee';
import { EmployeeService } from '../employee-service';
import { NotificationService } from '../shared/notification.service';

@Component({
  selector: 'app-create-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './create-employee.html',
  styleUrls: ['./create-employee.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateEmployeeComponent implements OnInit, OnDestroy {
  
  // Public properties
  readonly employeeForm: FormGroup;
  isSubmitting = false;

  // Private properties
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly employeeService: EmployeeService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.employeeForm = this.createEmployeeForm();
  }

  ngOnInit(): void {
    // Component initialization logic (if needed)
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Public methods
  saveEmployee(): void {
    if (this.employeeForm.invalid) {
      this.markFormGroupTouched();
      this.notificationService.showWarning('Please fill in all required fields correctly.');
      return;
    }

    if (this.isSubmitting) {
      return; // Prevent double submission
    }

    this.isSubmitting = true;
    this.cdr.markForCheck();

    const employee: Employee = this.employeeForm.value;
    
    this.employeeService.createEmployee(employee)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('Employee created successfully:', data);
          this.notificationService.showSuccess('Employee created successfully!');
          this.navigateToEmployeeList();
        },
        error: (error) => {
          console.error('Error creating employee:', error);
          this.notificationService.showError('Error creating employee. Please try again.');
          this.isSubmitting = false;
          this.cdr.markForCheck();
        }
      });
  }

  onSubmit(): void {
    this.saveEmployee();
  }

  // Form validation getters
  get firstNameControl(): AbstractControl | null {
    return this.employeeForm.get('firstName');
  }

  get lastNameControl(): AbstractControl | null {
    return this.employeeForm.get('lastName');
  }

  get emailControl(): AbstractControl | null {
    return this.employeeForm.get('email');
  }

  // Private methods
  private createEmployeeForm(): FormGroup {
    return this.formBuilder.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]]
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();
    });
    this.cdr.markForCheck();
  }

  private navigateToEmployeeList(): void {
    this.router.navigate(['/employees']);
  }
}

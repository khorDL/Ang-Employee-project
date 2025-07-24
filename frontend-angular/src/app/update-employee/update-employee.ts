import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-update-employee',
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
  templateUrl: './update-employee.html',
  styleUrls: ['./update-employee.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateEmployeeComponent implements OnInit, OnDestroy {

  // Public properties
  readonly employeeForm: FormGroup;
  isLoading = false;
  isSubmitting = false;
  employeeId: number | null = null;

  // Private properties
  private readonly destroy$ = new Subject<void>();
  private originalEmployee: Employee | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly employeeService: EmployeeService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.employeeForm = this.createEmployeeForm();
  }

  ngOnInit(): void {
    this.loadEmployeeData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Public methods
  updateEmployee(): void {
    if (this.employeeForm.invalid) {
      this.markFormGroupTouched();
      this.notificationService.showWarning('Please fill in all required fields correctly.');
      return;
    }

    if (this.isSubmitting || !this.employeeId || !this.originalEmployee) {
      return;
    }

    this.isSubmitting = true;
    this.cdr.markForCheck();

    const updatedEmployee: Employee = {
      ...this.originalEmployee,
      ...this.employeeForm.value
    };

    this.employeeService.updateEmployeeDetails(this.employeeId, updatedEmployee)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          console.log('Employee updated successfully:', data);
          const fullName = `${updatedEmployee.firstName} ${updatedEmployee.lastName}`;
          this.notificationService.showSuccess(`${fullName} has been updated successfully!`);
          this.navigateToEmployeeList();
        },
        error: (error: any) => {
          console.error('Error updating employee:', error);
          this.notificationService.showError('Error updating employee. Please try again.');
          this.isSubmitting = false;
          this.cdr.markForCheck();
        }
      });
  }

  onSubmit(): void {
    this.updateEmployee();
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
  private loadEmployeeData(): void {
    const idParam = this.route.snapshot.params['id'];
    this.employeeId = idParam ? parseInt(idParam, 10) : null;
    
    if (!this.employeeId) {
      this.notificationService.showError('Invalid employee ID');
      this.navigateToEmployeeList();
      return;
    }

    this.isLoading = true;
    this.cdr.markForCheck();

    this.employeeService.getEmployeeById(this.employeeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employee) => {
          this.originalEmployee = employee;
          this.populateForm(employee);
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error fetching employee:', error);
          this.notificationService.showError('Error loading employee data.');
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  private populateForm(employee: Employee): void {
    this.employeeForm.patchValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email
    });
  }

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

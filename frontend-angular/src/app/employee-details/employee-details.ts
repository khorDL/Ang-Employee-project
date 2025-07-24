import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

import { Employee } from '../employee';
import { EmployeeService } from '../employee-service';
import { NotificationService } from '../shared/notification.service';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './employee-details.html',
  styleUrls: ['./employee-details.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeDetailsComponent implements OnInit, OnDestroy {

  // Public properties
  employee: Employee | null = null;
  isLoading = false;
  employeeId: number | null = null;

  // Private properties
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly employeeService: EmployeeService,
    private readonly notificationService: NotificationService,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadEmployeeDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Public methods
  editEmployee(): void {
    if (this.employeeId) {
      this.router.navigate(['/update-employee', this.employeeId]);
    }
  }

  deleteEmployee(): void {
    if (!this.employee || !this.employeeId) {
      return;
    }

    const fullName = `${this.employee.firstName} ${this.employee.lastName}`;
    const confirmDelete = confirm(`Are you sure you want to delete ${fullName}? This action cannot be undone.`);

    if (confirmDelete) {
      this.performDelete();
    }
  }

  goBackToList(): void {
    this.router.navigate(['/employees']);
  }

  // Private methods
  private loadEmployeeDetails(): void {
    const idParam = this.route.snapshot.params['id'];
    this.employeeId = idParam ? parseInt(idParam, 10) : null;

    if (!this.employeeId) {
      this.notificationService.showError('Invalid employee ID');
      this.goBackToList();
      return;
    }

    this.isLoading = true;
    this.cdr.markForCheck();

    console.log('Loading employee details for ID:', this.employeeId);

    this.employeeService.getEmployeeById(this.employeeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employee: Employee) => {
          this.employee = employee;
          this.isLoading = false;
          this.cdr.markForCheck();
          console.log('Employee details loaded:', employee);
        },
        error: (error: any) => {
          console.error('Error fetching employee:', error);
          this.notificationService.showError('Error loading employee details.');
          this.isLoading = false;
          // Show dummy data for demo purposes
          this.employee = this.getDummyEmployee();
          this.cdr.markForCheck();
        }
      });
  }

  private performDelete(): void {
    if (!this.employeeId || !this.employee) {
      return;
    }

    const fullName = `${this.employee.firstName} ${this.employee.lastName}`;

    this.employeeService.deleteEmployee(this.employeeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Employee deleted successfully');
          this.notificationService.showSuccess(`${fullName} has been deleted successfully!`);
          this.goBackToList();
        },
        error: (error: any) => {
          console.error('Error deleting employee:', error);
          this.notificationService.showError('Error deleting employee. Please try again.');
        }
      });
  }

  private getDummyEmployee(): Employee {
    return {
      id: this.employeeId || 1,
      firstName: 'Demo',
      lastName: 'Employee',
      email: 'demo@example.com'
    };
  }
}

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, timeout, catchError, of, finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';

import { Employee } from '../employee';
import { EmployeeService } from '../employee-service';
import { NotificationService } from '../shared/notification.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './employee-list.html',
  styleUrls: ['../shared/shared-components.css', './employee-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class EmployeeListComponent implements OnInit, OnDestroy, AfterViewInit {
  
  // ViewChild for paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  // Public properties
  employees: Employee[] = [];
  dataSource = new MatTableDataSource<Employee>([]);
  readonly displayedColumns: string[] = ['firstName', 'lastName', 'email', 'actions'];
  isLoading = false;
  searchTerm: string = '';
  
  // Computed properties for template
  get totalEmployees(): number {
    return this.dataSource.data.length;
  }
  
  get filteredEmployees(): Employee[] {
    return this.dataSource.filteredData;
  }
  
  // Private properties
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngAfterViewInit(): void {
    // Connect paginator after view init
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    
    // Set up filter predicate
    this.dataSource.filterPredicate = (employee: Employee, filter: string) => {
      const searchTerm = filter.toLowerCase().trim();
      return employee.firstName.toLowerCase().includes(searchTerm) ||
             employee.lastName.toLowerCase().includes(searchTerm) ||
             employee.email.toLowerCase().includes(searchTerm);
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Public methods
  refreshEmployees(): void {
    this.loadEmployees();
  }

  updateEmployeeDetails(id: number): void {
    this.router.navigate(['/update-employee', id]);
  }

  viewEmployeeDetails(id: number): void {
    this.router.navigate(['/employee-details', id]);
  }

  deleteEmployee(id: number): void {
    const employee = this.employees.find(emp => emp.id === id);
    const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'this employee';
    
    const confirmDelete = confirm(`Are you sure you want to delete ${employeeName}? This action cannot be undone.`);
    
    if (confirmDelete) {
      this.performDelete(id, employeeName);
    }
  }

  onSearchChange(): void {
    this.applySearchFilter();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applySearchFilter();
  }

  // Private methods
  private loadEmployees(): void {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.employeeService.getEmployeesList()
      .pipe(
        timeout(10000),
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Error fetching employees:', error);
          this.notificationService.showError('Failed to load employees. Showing demo data.');
          return of(this.getDummyEmployees());
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (data) => {
          this.employees = data || [];
          this.dataSource.data = this.employees;
          
          // Force reconnect paginator after data load
          setTimeout(() => {
            if (this.paginator && !this.dataSource.paginator) {
              this.dataSource.paginator = this.paginator;
            }
            this.cdr.detectChanges();
          }, 0);
        }
      });
  }

  private performDelete(id: number, employeeName: string): void {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.employeeService.deleteEmployee(id)
      .pipe(
        timeout(5000), // 5 second timeout for delete
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.notificationService.showSuccess(`${employeeName} has been deleted successfully!`);
          this.employees = this.employees.filter(emp => emp.id !== id);
          this.dataSource.data = this.employees;
          this.applySearchFilter();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          this.notificationService.showError('Failed to delete employee. Please try again.');
        }
      });
  }

  private getDummyEmployees(): Employee[] {
    return [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
      { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com' },
      { id: 4, firstName: 'Alice', lastName: 'Brown', email: 'alice.brown@example.com' },
      { id: 5, firstName: 'Charlie', lastName: 'Wilson', email: 'charlie.wilson@example.com' },
      { id: 6, firstName: 'Diana', lastName: 'Davis', email: 'diana.davis@example.com' },
      { id: 7, firstName: 'Edward', lastName: 'Miller', email: 'edward.miller@example.com' },
      { id: 8, firstName: 'Fiona', lastName: 'Garcia', email: 'fiona.garcia@example.com' },
      { id: 9, firstName: 'George', lastName: 'Rodriguez', email: 'george.rodriguez@example.com' },
      { id: 10, firstName: 'Hannah', lastName: 'Martinez', email: 'hannah.martinez@example.com' },
      { id: 11, firstName: 'Ian', lastName: 'Anderson', email: 'ian.anderson@example.com' },
      { id: 12, firstName: 'Julia', lastName: 'Taylor', email: 'julia.taylor@example.com' }
    ];
  }

  private applySearchFilter(): void {
    // Apply filter to MatTableDataSource
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
    
    // Reset to first page when filtering
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    
    this.cdr.detectChanges();
  }
}

import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee';
import { EmployeeService } from '../employee-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-employee',
  standalone: false,
  templateUrl: './create-employee.html',
  styleUrls: ['./create-employee.css']
})
export class CreateEmployee implements OnInit {
  employee: Employee = new Employee();

  constructor(private employeeService: EmployeeService, private router:Router){}

  ngOnInit(): void {
  }

  saveEmployee() {
    this.employeeService.createEmployee(this.employee).subscribe({
      next: (response) => {
        console.log('Employee created:', response);
        this.goToEmployeeList();
      },
      error: (error) => {
        console.error('Error creating employee:', error);
      }
    });
  }

  goToEmployeeList() {
    this.router.navigate(['/employees']);
  }

  onSubmit() {
    console.log('Employee created:', this.employee);
    this.saveEmployee();
   }

}

import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee';
import { EmployeeService } from '../employee-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  standalone: false,
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeList implements OnInit{
  employees!: Employee[];

  constructor(private employeeService: EmployeeService, private router: Router) { }

  ngOnInit(): void {
     this.getEmployees();
  }

  getEmployees(): void {
    this.employeeService.getEmployeesList().subscribe(data => {
        this.employees = data;
    });
  }

  updateEmployee(id: number) {
   this.router.navigate(['/update-employee', id]);
   }
   
   deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id).subscribe(data =>{
      console.log('Employee deleted:', data);
      this.getEmployees();
    });
  }

  employeeDetails(id: number) {
    this.router.navigate(['/employee-details', id]);
  }
}

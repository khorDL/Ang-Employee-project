import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee';
import { EmployeeService } from '../employee-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-employee',
  standalone: false,
  templateUrl: './update-employee.html',
  styleUrl: './update-employee.css'
})
export class UpdateEmployee implements OnInit {
  employee: Employee = new Employee();
  id!: number;

  constructor(private employeeService: EmployeeService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
  this.id = this.route.snapshot.params['id'];

    this.employeeService.getEmployeeById(this.id).subscribe(data => {
      this.employee = data;
    }, error => console.log(error));
  }

  onSubmit() {
    this.employeeService.updateEmployee(this.id, this.employee).subscribe({
      next: (response) => {
        console.log('Employee updated:', response);
        this.goToEmployeeList();
      },
      error: (error) => {
        console.error('Error updating employee:', error);
      }
    });
  }

  goToEmployeeList() {
    this.router.navigate(['/employees']);
  }
}

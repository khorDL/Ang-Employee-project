import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../employee-service';
import { Employee } from '../employee';

@Component({
  selector: 'app-employee-details',
  standalone: false,
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css'
})
export class EmployeeDetails implements OnInit{
  id!: number;
  employee!: Employee;
  constructor(private route:ActivatedRoute, private employeeService: EmployeeService){}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    console.log('Employee ID:', id);

    this.employee = new Employee();
    this.employeeService.getEmployeeById(id).subscribe( data => {
      this.employee = data;
    });
  }
}

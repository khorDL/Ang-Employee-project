import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list';
import { CreateEmployeeComponent } from './create-employee/create-employee';
import { UpdateEmployeeComponent } from './update-employee/update-employee';
import { EmployeeDetailsComponent } from './employee-details/employee-details';
import { Login } from './login/login';
import { Register } from './register/register';

export const routes: Routes = [
   { path: 'login', component: Login },
  { path: 'register', component: Register },
  {path: 'employees', component: EmployeeListComponent},
  {path: 'create-employee', component: CreateEmployeeComponent},
  {path: 'update-employee/:id', component: UpdateEmployeeComponent},
  {path: 'employee-details/:id', component: EmployeeDetailsComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // ← Redirect to login
  { path: '**', redirectTo: '/login' }  // ← Wildcard route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

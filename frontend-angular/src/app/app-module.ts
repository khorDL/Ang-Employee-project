import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { EmployeeList } from './employee-list/employee-list';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CreateEmployee } from './create-employee/create-employee';
import { FormsModule } from '@angular/forms';
import { UpdateEmployee } from './update-employee/update-employee';
import { EmployeeDetails } from './employee-details/employee-details';

@NgModule({
  declarations: [
    App,
    EmployeeList,
    CreateEmployee,
    UpdateEmployee,
    EmployeeDetails
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
  ],
  bootstrap: [App]
})
export class AppModule { }

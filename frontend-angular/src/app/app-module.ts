
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// Routing Module
import { AppRoutingModule } from './app-routing-module';

// Components
import { AppComponent } from './app';
import { EmployeeListComponent } from './employee-list/employee-list';
import { CreateEmployeeComponent } from './create-employee/create-employee';
import { UpdateEmployeeComponent } from './update-employee/update-employee';
import { EmployeeDetailsComponent } from './employee-details/employee-details';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Register } from './register/register';
import { Login } from './login/login';

@NgModule({
  declarations: [
    Register,
    Login
  ],
  imports: [
    // Core Angular Modules
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    
    // Angular Material Modules
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatListModule,
    MatSidenavModule
  ],
  providers: [
    // HTTP Client Provider
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: []
})
export class AppModule { }

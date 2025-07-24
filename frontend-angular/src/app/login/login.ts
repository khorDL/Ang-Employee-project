import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = 'An error occurred';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

onSubmit(): void {
  if (this.loginForm.valid && !this.isLoading) {
    this.isLoading = true;
    this.errorMessage = '';
    
    const credentials = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };
    
    // Subscribe to the Observable
    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Success - user is logged in
        console.log('Login successful:', response);
        this.router.navigate(['/employees']);
        this.isLoading = false;
      },
      error: (error) => {
        // Error - show message
        console.error('Login failed:', error);
        this.errorMessage = error.message || 'Login failed';
        this.isLoading = false;
      }
    });
  }
}

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}

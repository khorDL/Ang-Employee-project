import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterRequest } from '../models/user.model';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm:FormGroup;
  hidePassword =true;
  hideConfirmPassword= true;
  errorMessage='';
  isLoading=false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ){
    this.registerForm = this.createForm();
  }

  private createForm():FormGroup{
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl) : {[key:string]: any} |null{
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void{
    if(this.registerForm.valid && !this.isLoading){
      this.isLoading = true;
      this.errorMessage = '';

      const {confirmPassword, ...registerData} = this.registerForm.value;

      this.authService.register(registerData as RegisterRequest).subscribe({
        next: (response) => {
          // Registration successful
          console.log('Registration successful:', response);
          this.router.navigate(['/employees']);
          this.isLoading = false;
        },
        error: (error) => {
          // Registration failed
          console.error('Registration failed:', error);
          this.errorMessage = error.message || 'Registration failed';
          this.isLoading = false;
        }
      });
   
  }else{
    this.markFormGroupTouched();
  }

}


  private markFormGroupTouched():void{
    Object.keys(this.registerForm.controls).forEach(key =>{
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  togglePasswordVisibility():void{
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  get firstName(){return this.registerForm.get('firstName');}
  get lastName(){return this.registerForm.get('lastName');}
  get email(){return this.registerForm.get('email');}
  get password(){return this.registerForm.get('password');}
  get confirmPassword(){return this.registerForm.get('confirmPassword');}
}

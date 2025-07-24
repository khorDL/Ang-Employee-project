import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, tap, catchError, delay } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse, RegisterRequest, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  // Observable to track authentication state
  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  // Mock users for development (remove when connecting to SpringBoot)
  private mockUsers: User[] = [
    {
      id: 1,
      email: 'admin@company.com',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      department: 'IT',
      jobTitle: 'System Administrator',
      hireDate: new Date('2020-01-15')
    },
    {
      id: 2,
      email: 'hr@company.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: UserRole.HR,
      department: 'Human Resources',
      jobTitle: 'HR Manager',
      hireDate: new Date('2021-03-10')
    }
  ];

  constructor(private http: HttpClient) {}

  // Login method with mock data for now
  login(credentials: LoginRequest): Observable<LoginResponse> {
    // TODO: Replace with actual HTTP call to SpringBoot
    // return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials)

    // Mock implementation for development
    return of(null).pipe(
      delay(1500), // Simulate network delay
      map(() => {
        // Check if user exists in mock data
        const user = this.mockUsers.find(u => u.email === credentials.email);
        
        if (!user || credentials.password !== 'password123') {
          throw new Error('Invalid email or password');
        }

        // Generate mock JWT token
        const token = this.generateMockToken(user);
        const response: LoginResponse = {
          token,
          user: { ...user, password: undefined }, // Remove password from response
          expiresIn: 3600 // 1 hour
        };

        return response;
      }),
      tap(response => {
        // Store token and user data
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
        
        // Update current user subject
        this.currentUserSubject.next(response.user);
      }),
      catchError(this.handleError)
    );
  }

  // Register method with mock data for now
  register(userData: RegisterRequest): Observable<LoginResponse> {
    // TODO: Replace with actual HTTP call to SpringBoot
    // return this.http.post<LoginResponse>(`${this.API_URL}/register`, userData)

    // Mock implementation for development
    return of(null).pipe(
      delay(2000), // Simulate network delay
      map(() => {
        // Check if email already exists
        if (this.mockUsers.find(u => u.email === userData.email)) {
          throw new Error('Email already exists');
        }

        // Create new user
        const newUser: User = {
          id: this.mockUsers.length + 1,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role || UserRole.EMPLOYEE,
          department: userData.department,
          hireDate: new Date(),
          createdAt: new Date()
        };

        // Add to mock users array
        this.mockUsers.push(newUser);

        // Generate mock JWT token
        const token = this.generateMockToken(newUser);
        const response: LoginResponse = {
          token,
          user: { ...newUser, password: undefined },
          expiresIn: 3600
        };

        return response;
      }),
      tap(response => {
        // Auto-login after successful registration
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      }),
      catchError(this.handleError)
    );
  }

  // Logout method
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // For mock tokens, just check if exists
    // TODO: Add real JWT expiry check when connecting to SpringBoot
    return true;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Check user role
  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  // Private helper methods
  private getCurrentUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  private generateMockToken(user: User): string {
    // Generate a mock JWT token for development
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
    }));
    const signature = btoa('mock-signature');
    
    return `${header}.${payload}.${signature}`;
  }

  private handleError(error: any) {
    let errorMessage = 'An error occurred';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}

// User model combining authentication and employee data
export interface User {
  id?: number;
  // Authentication fields
  email: string;
  password?: string; // Optional for responses (security)
  role: UserRole;
  
  // Employee fields
  firstName: string;
  lastName: string;
  department?: string;
  jobTitle?: string;
  salary?: number;
  hireDate?: Date;
  
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  department?: string;
  role?: UserRole;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  HR = 'HR',
  EMPLOYEE = 'EMPLOYEE'
}

export const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Marketing',
  'Sales',
  'Finance',
  'Operations',
  'Customer Support',
  'Legal'
];

export const JOB_TITLES = [
  'Software Engineer',
  'Senior Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'HR Manager',
  'Marketing Manager',
  'Sales Representative',
  'Financial Analyst',
  'Operations Manager'
];

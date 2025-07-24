package com.example.backendSpringboot.service;

import com.example.backendSpringboot.domain.Employee;

import java.util.*;

public interface EmployeeService {
    List<Employee> getAllEmployees();
    Employee getEmployeeById(Long id);
    Employee createEmployee(Employee employee);
    Employee updateEmployee(Long id, Employee employee);
    void deleteEmployee(Long id);
}

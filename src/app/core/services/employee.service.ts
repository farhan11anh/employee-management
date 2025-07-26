import { Injectable } from "@angular/core";
import { BehaviorSubject, map } from "rxjs";
import { Employee } from "../models/employee.model";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class EmployeeService {
    private employees$ = new BehaviorSubject<Employee[]>([]);
    employees = this.employees$.asObservable();

    constructor(
        private http: HttpClient
    ){
        this.loadEmployees();
    }

    loadEmployees(){
        this.http.get<Employee[]>('assets/data/employees.json')
            .pipe(
                map(data =>
                    data.map(employee => ({
                        ...employee,
                        birthDate: new Date(employee.birthDate).toISOString().split('T')[0], // Format date to YYYY-MM-DD,
                        description: new Date(employee.description).toISOString().split('T')[0] // Format description to YYYY-MM-DD
                    }))
                )
            )
            .subscribe(
                employees => this.employees$.next(employees),
                error => console.error('Error loading employees:', error)
            );
    }

    getEmployees() {
        return this.employees$.asObservable();
    }

    removeEmployee(id: number) {
        console.log(`Removing employee with ID: ${id}`);
        
        const currentEmployees = this.employees$.getValue();
        const updatedEmployees = currentEmployees.filter(employee => employee.id !== id);
        this.employees$.next(updatedEmployees);
    }
}
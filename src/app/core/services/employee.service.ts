import { Injectable } from "@angular/core";
import { BehaviorSubject, map } from "rxjs";
import { Employee } from "../models/employee.model";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    private employees$ = new BehaviorSubject<Employee[]>([]);
    employees = this.employees$.asObservable();
    private storageKey = 'employeeData';

    constructor(
        private http: HttpClient
    ) {
        this.loadEmployees();
    }

private loadEmployees() {
        // Coba load dari localStorage dulu
        const savedData = localStorage.getItem(this.storageKey);
        if (savedData) {
            this.employees$.next(JSON.parse(savedData));
            return;
        }

        // Jika tidak ada, load dari JSON
        this.http.get<Employee[]>('assets/data/employees.json').pipe(
            map(data => 
                data.map(employee => ({
                    ...employee,
                    birthDate: new Date(employee.birthDate).toISOString().split('T')[0],
                    description: new Date(employee.description).toISOString().split('T')[0]
                }))
            )
        ).subscribe({
            next: employees => {
                this.employees$.next(employees);
                this.saveToLocalStorage(employees);
            },
            error: err => console.error('Error loading employees:', err)
        });
    }

    private saveToLocalStorage(employees: Employee[]) {
        localStorage.setItem(this.storageKey, JSON.stringify(employees));
    }

    addEmployee(newEmployee: Omit<Employee, 'id'>) {
        const currentEmployees = this.employees$.getValue();
        const newId = this.generateNewId(currentEmployees);
        
        const employeeToAdd: Employee = {
            ...newEmployee,
            id: newId,
            birthDate: new Date(newEmployee.birthDate).toISOString().split('T')[0],
            description: new Date().toISOString().split('T')[0]
        };

        const updatedEmployees = [employeeToAdd, ...currentEmployees];
        this.employees$.next(updatedEmployees);
        this.saveToLocalStorage(updatedEmployees); // Simpan ke localStorage
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

    private generateNewId(employees: Employee[]): number {
        const maxId = employees.reduce((max, emp) => Math.max(max, emp.id), 0);
        return Math.max(maxId + 1, 200);
    }
}
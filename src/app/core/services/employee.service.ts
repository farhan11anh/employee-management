import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, of } from "rxjs";
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

        // Update BehaviorSubject dan localStorage
        this.employees$.next(updatedEmployees);
        this.saveToLocalStorage(updatedEmployees); // <-- Tambahkan ini

        // Optional: Beri feedback
        console.log('Employee deleted and changes saved to localStorage');
    }

    private generateNewId(employees: Employee[]): number {
        const maxId = employees.reduce((max, emp) => Math.max(max, emp.id), 0);
        return Math.max(maxId + 1, 200);
    }

    getEmployeeById(id: number): Observable<Employee | undefined> {
        // Cari employee dari BehaviorSubject current value
        const currentEmployees = this.employees$.getValue();
        const foundEmployee = currentEmployees.find(e => e.id === id);

        // Jika ditemukan, kembalikan sebagai Observable
        if (foundEmployee) {
            return of(foundEmployee);
        }

        // Jika tidak ditemukan di cache, coba load dari localStorage
        const savedData = localStorage.getItem(this.storageKey);
        if (savedData) {
            const employees: Employee[] = JSON.parse(savedData);
            const employee = employees.find(e => e.id === id);
            if (employee) {
                return of(employee);
            }
        }

        // Jika masih tidak ditemukan, kembalikan undefined
        return of(undefined);
    }

    updateEmployee(updatedEmployee: Employee) {
        const currentEmployees = this.employees$.getValue();
        const updatedEmployees = currentEmployees.map(emp =>
            emp.id === updatedEmployee.id ? updatedEmployee : emp
        );

        this.employees$.next(updatedEmployees);
        this.saveToLocalStorage(updatedEmployees);
        return of(updatedEmployee); // Return observable untuk handling response
    }

    getStatistics() {
    const employees = this.employees$.getValue();
    const total = employees.length;
    const active = employees.filter(e => e.status === 'active').length;
    const departments = [...new Set(employees.map(e => e.group))];
    const avgSalary = employees.reduce((sum, emp) => sum + emp.basicSalary, 0) / total;

    return {
      totalEmployees: total,
      activeEmployees: active,
      departments: departments,
      avgSalary: avgSalary || 0
    };
  }

  getRecentEmployees(count: number = 5) {
    return this.employees$.pipe(
      map(employees => 
        employees
          .sort((a, b) => new Date(b.description).getTime() - new Date(a.description).getTime())
          .slice(0, count)
      )
    );
  }
}
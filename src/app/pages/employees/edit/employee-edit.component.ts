import { Component, OnInit, OnDestroy, AfterViewInit, DoCheck, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, Location } from '@angular/common';
import { SHARED_MATERIAL_IMPORTS } from '../../../shared/shared-material';
import { SHARED_ZORRO_MATERIALS } from '../../../shared/shared-zorro-materials';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
    selector: 'app-employee-edit',
    templateUrl: './employee-edit.component.html',
    styleUrls: ['./employee-edit.component.scss'],
    providers: [DatePipe],
    standalone: true,
    imports: [
        ...SHARED_MATERIAL_IMPORTS,
        ...SHARED_ZORRO_MATERIALS
    ]
})
export class EmployeeEditComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
    employeeForm!: FormGroup;
    employeeId!: number;
    groups = ['IT', 'Finance', 'HR', 'Marketing', 'Customer Service'];
    isLoading = false;
    private formChangesSubscription: any;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private employeeService: EmployeeService,
        private toastr: ToastrService,
        private datePipe: DatePipe,
        private location: Location
    ) { }

    ngOnInit() {
        console.log('ngOnInit called');
        this.employeeId = +this.route.snapshot.paramMap.get('id')!;
        this.initForm();
        this.loadEmployeeData();

        // Subscribe to form value changes
        this.formChangesSubscription = this.employeeForm.valueChanges.subscribe(values => {
            console.log('Form values changed:', values);
        });
    }

    ngDoCheck() {
        console.log('ngDoCheck called - change detection cycle');
    }

    ngAfterViewInit() {
        console.log('ngAfterViewInit called - view initialized');
    }

    ngOnDestroy() {
        if (this.formChangesSubscription) {
            this.formChangesSubscription.unsubscribe();
        }
    }

    initForm() {
        this.employeeForm = this.fb.group({
            username: ['', [
                Validators.required,
                Validators.minLength(3),
            ]],
            firstName: ['', [
                Validators.required,
                Validators.pattern(/^[a-zA-Z ]+$/)
            ]],
            lastName: ['', [
                Validators.required,
                Validators.pattern(/^[a-zA-Z ]+$/)
            ]],
            email: ['', [
                Validators.required,
                Validators.email,
            ]],
            birthDate: ['', [
                Validators.required,
                this.ageValidator(18)
            ]],
            basicSalary: ['', [
                Validators.required,
                Validators.min(1000000),
                Validators.max(100000000)
            ]],
            status: ['active', Validators.required],
            group: ['', Validators.required],
        });
    }

    ageValidator(minAge: number) {
        return (control: any) => {
            if (!control.value) return null;

            const birthDate = new Date(control.value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            return age >= minAge ? null : { underage: { minAge } };
        };
    }

    loadEmployeeData() {
        this.isLoading = true;
        this.employeeService.getEmployeeById(this.employeeId).subscribe({
            next: (employee) => {
                if (employee) {
                    this.employeeForm.patchValue({
                        ...employee,
                        birthDate: new Date(employee.birthDate)
                    });
                } else {
                    this.toastr.error('Employee not found', 'Error');
                    this.router.navigate(['/employees']);
                }
                this.isLoading = false;
            },
            error: (err) => {
                this.toastr.error('Failed to load employee data', 'Error');
                console.error(err);
                this.isLoading = false;
            }
        });
    }

    onSubmit() {
        console.log('Form submitted with values:', this.employeeForm.valid, this.employeeForm);
        
        if (this.employeeForm.valid) {
            this.isLoading = true;
            const updatedEmployee = {
                ...this.employeeForm.value,
                id: this.employeeId,
                birthDate: this.datePipe.transform(this.employeeForm.value.birthDate, 'yyyy-MM-dd')!,
            };

            this.employeeService.updateEmployee(updatedEmployee).subscribe({
                next: () => {
                    this.toastr.success('Employee updated successfully!', 'Success');
                    this.location.back(); // Navigate back without reloading
                    this.employeeForm.reset();
                    this.isLoading = false;
                },
                error: (err) => {
                    this.toastr.error('Failed to update employee', 'Error');
                    console.error(err);
                    this.isLoading = false;
                }
            });
        } else {
            this.markFormGroupTouched(this.employeeForm);
        }
    }

    onCancel() {
        this.location.back(); // Navigate back without reloading
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }
}
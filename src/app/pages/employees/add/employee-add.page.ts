import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee.service';
import { SHARED_MATERIAL_IMPORTS } from '../../../shared/shared-material';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [
    ...SHARED_MATERIAL_IMPORTS
  ],
  templateUrl: './employee-add.page.html',
  styleUrl: './employee-add.page.css'
})
export class EmployeeAddPage implements OnInit, OnDestroy {
  employeeForm: FormGroup;
  groups = ['IT', 'Finance', 'HR', 'Marketing', 'Customer Service'];
  private formSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private toastr: ToastrService,
    private location: Location
  ) {
    this.employeeForm = this.createForm();
  }

  ngOnInit() {
    this.formSubscription = this.employeeForm.valueChanges.subscribe(() => {
      // Optional: Add any form change tracking logic here
    });
  }

  ngOnDestroy() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9._-]+$/)
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
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
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
      group: ['', Validators.required]
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

  onSubmit() {
    if (this.employeeForm.valid) {
      this.employeeService.addEmployee(this.employeeForm.value);
      this.toastr.success('Employee added successfully!', 'Success', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
      this.employeeForm.reset();
      setTimeout(() => {
        this.location.back();
      }, 100);
    } else {
      this.toastr.error('Please fill out the form correctly.', 'Error', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
      this.markFormGroupTouched(this.employeeForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/employees']);
  }
}
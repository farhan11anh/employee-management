import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee.service';
import { SHARED_MATERIAL_IMPORTS } from '../../../shared/shared-material';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-employee-add',
  imports: [
    ...SHARED_MATERIAL_IMPORTS
  ],
  templateUrl: './employee-add.page.html',
  styleUrl: './employee-add.page.css'
})
export class EmployeeAddPage {
  employeeForm: FormGroup;
  groups = ['IT', 'Finance', 'HR', 'Marketing', 'Customer Service'];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private toastr: ToastrService,
    private location: Location
  ) {
    this.employeeForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9._-]+$/) // Hanya karakter alfanumerik dan beberapa simbol
      ]],
      firstName: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z ]+$/) // Hanya huruf dan spasi
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
        this.ageValidator(18) // Minimal usia 18 tahun
      ]],
      basicSalary: ['', [
        Validators.required,
        Validators.min(1000000), // Minimal gaji 1 juta
        Validators.max(100000000) // Maksimal gaji 100 juta
      ]],
      status: ['active', Validators.required],
      group: ['', Validators.required]
    });
  }

  // Custom validator untuk usia minimal
  ageValidator(minAge: number) {
    return (control: any) => {
      if (!control.value) {
        return null;
      }

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
        this.location.back(); // Kembali tanpa reload
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

  // Mark semua field sebagai touched untuk menampilkan error
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

import { Component } from '@angular/core';
import { SHARED_MATERIAL_IMPORTS } from '../../shared/shared-material';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ...SHARED_MATERIAL_IMPORTS
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css'
})
export class LoginForm {
  loginForm;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    // Dummy credential check
    if (email === 'admin@example.com' && password === 'admin123') {
      this.toastr.success('Login berhasil!','', {
        closeButton: true,
        progressBar: true,
      });
      localStorage.setItem('token', '999999'); // Simulate token storage
      // Redirect to employees page after successful login
      this.router.navigate(['/employees']);
    } else {
      this.toastr.error('Email atau password salah!','', {
        closeButton: true,
        progressBar: true,
      });
    }
  }
}

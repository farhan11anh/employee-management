import { Component } from '@angular/core';
import { LoginForm } from '../../components/login/login-form';

@Component({
  selector: 'app-login',
  imports: [
    LoginForm
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css'
})
export class LoginPage {

}

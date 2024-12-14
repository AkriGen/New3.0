import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthenticatedResponse } from '../../interfaces/authenticated-response';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Login } from '../../interfaces/login';
import { AutharizeService } from '../../services/autharize.service';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string;
  email: string;
  password: string;

  constructor(private authService: AutharizeService, private router: Router) {}

  onSubmit(): void {
    
    this.authService.loginAdmin(this.username, this.email, this.password).subscribe(
      (response) => {
        // Store auth token and user role
        this.authService.storeAuthData(response.token, 'admin');
        this.router.navigate(['/admin-panel']);
      },
      (error) => {
        console.error('Error logging in:', error);
        alert('Invalid login credentials');
      }
    );
  }
}
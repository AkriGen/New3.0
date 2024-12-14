import { Component } from '@angular/core';
import { AutharizeService } from '../../services/autharize.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userlogin',
  standalone: false,
  
  templateUrl: './userlogin.component.html',
  styleUrl: './userlogin.component.css'
})
export class UserloginComponent {

  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AutharizeService, private router: Router) {}

  login(): void {
    this.authService.loginUser(this.username, this.email, this.password).subscribe(
      (response) => {
        this.authService.storeAuthData(response.token, 'user');
        this.router.navigate(['/']); // Redirect to user profile
      },
      (error) => {
        this.errorMessage = 'Invalid user credentials. Please try again.';
        console.error('User Login Error:', error);
      }
    );
  }

}

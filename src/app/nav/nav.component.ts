import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: false,
  
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit{
  isLoggedIn: boolean = false;

  constructor(private userService: UserService, private router: Router) {}
  ngOnInit(): void {
    // Check if the user is logged in by getting the user data
    const currentUser = this.userService.getStoredUserData();
    this.isLoggedIn = currentUser && currentUser.email ? true : false;
  }

  // Log the user out
  logout(): void {
    this.userService.clearUserData;  // This clears the user data
    this.isLoggedIn = false;  // Update the UI
    this.router.navigate(['/']);  // Redirect to the home page after logout
  }

}

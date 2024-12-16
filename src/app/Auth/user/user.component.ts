import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from '../../services/address.service';
import { AutharizeService } from '../../services/autharize.service';
import { ToastrServiceWrapper } from '../../toastr.service';
@Component({
  selector: 'app-user',
  standalone: false,
  
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{
  userData: any; // To store user data
  errorMessage: string | null = null;
  constructor(private authService: AutharizeService) {}

  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData(): void {
    this.authService.getUserProfile().subscribe(
      (data) => {
        this.userData = data; // Populate user data
      },
      (error) => {
        console.error('Error fetching user data:', error);
        this.errorMessage = 'Failed to fetch user data. Please try again later.';
      }
    );
  }
}

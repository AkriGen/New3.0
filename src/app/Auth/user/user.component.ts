import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from '../../services/address.service';
import { AutharizeService } from '../../services/autharize.service';
@Component({
  selector: 'app-user',
  standalone: false,
  
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{
  savedAddresses: any[] = [];
  userProfile: any;
  userId: number;
  userImage: File | null = null;  // Store the selected image file
  user: any = {}; // Object to hold user profile data
  isEditing: boolean = false;  // Track if the user is in edit mode


  constructor(
    private addressService: AddressService,
    private authService: AutharizeService,
    private router: Router
  ) {
    this.userId = Number(sessionStorage.getItem('userId')); // Retrieve userId from sessionStorage (stored on login)
 
  }

  ngOnInit(): void {
    this.loadUserProfile();
    // Get user profile data on component initialization
  }

  // Get user profile data
  loadUserProfile(): void {
    const userId = this.authService.decodeToken()?.userId;  // Decode the token to get userId
    if (userId) {
      this.authService.getUserProfile().subscribe(
        (data) => {
          this.userProfile = data;
        },
        (error) => {
          console.error("Error fetching user profile:", error);
        }
      );
    }
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.userImage = input.files[0];
    }
  }
  // Logout functionality
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // Redirect to login after logout
  }

  activeTab: number = 0; // Default tab

  isEditMode: boolean = false; // Flag for edit mode

  // Toggle edit mode
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  // Handle user profile update logic
  startEditing(): void {
    this.isEditing = true;
  }

  // Cancel editing mode
  cancelEdit(): void {
    this.isEditing = false;
    this.loadUserProfile();  // Reload the original user data
  }

  // Update user profile
  updateUserProfile(): void {
    const userId = this.authService.decodeToken()?.userId;
    if (userId && this.userProfile) {
      this.authService.updateUserProfile(userId, this.userProfile).subscribe(
        (response) => {
          console.log("Profile updated successfully:", response);
          this.isEditing = false;
          this.loadUserProfile();  // Reload the updated user profile
        },
        (error) => {
          console.error("Error updating user profile:", error);
        }
      );
    }
  }


  // Tab management logic
  setTab(index: number): void {
    this.activeTab = index;
  }
}
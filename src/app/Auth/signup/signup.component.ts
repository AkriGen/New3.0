
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AutharizeService } from '../../services/autharize.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  imports: [CommonModule, ReactiveFormsModule,FormsModule ],
})
export class SignupComponent {
  signupForm: FormGroup;
  selectedImage: File | null = null;
  validationErrors: string[] = [];

  constructor(private fb: FormBuilder, private authService: AutharizeService, private router: Router) {
    this.signupForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator });
  }

  // Custom validator to check if passwords match
  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];
    }
  }

  signup(): void {
    this.validationErrors = [];

    if (this.signupForm.invalid) {
      this.validationErrors.push('Please fill in all fields correctly.');
      return;
    }

    const { userName, email, password } = this.signupForm.value;

    const formData = new FormData();
    formData.append('UserName', userName);
    formData.append('Email', email);
    formData.append('Password', password);
    if (this.selectedImage) {
      formData.append('UserImage', this.selectedImage);
    }

    this.authService.signupWithImage(formData).subscribe(
      (response) => {
        console.log('Signup successful:', response);
        this.router.navigate(['/userlogin']);
      },
      (error) => {
        console.error('Signup failed:', error);
        if (error.error && error.error.message) {
          this.validationErrors.push(error.error.message);
        }
      }
    );
  }

  // Email validation function
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  }
}
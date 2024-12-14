import { Component } from '@angular/core';

@Component({
  selector: 'app-contactus',
  standalone: false,
  
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.css'
})
export class ContactusComponent {

  formData = {
    fullName: '',
    email: '',
    message: ''
  };
  onSubmit(): void {
    // Process form data here
    console.log('Form submitted', this.formData);
    // You can make an HTTP request to send the form data to a server
  }
}

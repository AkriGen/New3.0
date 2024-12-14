import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { PaymentService } from '../services/payment.service';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { AddressService } from '../services/address.service';

@Component({
  selector: 'app-payment',
  standalone: false,
  
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  
  cartItems = [];

  //saved add select 
  savedAddresses: any[] = [];
  newAddress: any = {
    street: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  };
  selectedAddress: any = null;
  isNewAddress: boolean = false;

  constructor(private addressService: AddressService,public cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    // Fetch saved addresses when the component initializes
    this.addressService.getSavedAddresses().subscribe((addresses) => {
      this.savedAddresses = addresses;
    });
    this.cartItems = this.cartService.getCartItems();

  }

  // Switch to 'New Address' mode to allow the user to enter a new address
  addNewAddress(): void {
    this.isNewAddress = true;
    this.selectedAddress = null; // Clear any previously selected address
  }

  // Select an existing address for shipping
  selectAddress(address: any): void {
    this.selectedAddress = address;
    this.isNewAddress = false; // Disable 'New Address' mode
  }

  // Save the new address to the address book
  saveNewAddress(): void {
    this.addressService.addAddress(this.newAddress);
    this.isNewAddress = false;
    this.selectedAddress = this.newAddress; // Select the newly added address
    this.resetNewAddressForm();
  }

  // Reset the new address form
  resetNewAddressForm(): void {
    this.newAddress = {
      street: '',
      phone: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    };
  }

  // Submit the payment along with the selected address
  proceedToPay(): void {
    if (this.selectedAddress) {
      // Here you would handle the payment logic, using the selected address
      console.log('Payment successful for shipping to:', this.selectedAddress);
      this.router.navigate(['/successpay']);  // Navigate to the payment page
      this.cartService.clearCart();
    } else {
      alert('Please select or enter an address for shipping.');
    }
  }
  //payment logic
  getCartTotal() {
    return this.cartService.getCartTotal();
  }

}

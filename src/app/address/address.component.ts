import { Component, OnInit } from '@angular/core';
import { AddressService } from '../services/address.service';
import { ToastrServiceWrapper } from '../toastr.service';

@Component({
  selector: 'app-address',
  standalone: false,
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  // User address object
  address: any = {
    street: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  };

  savedAddresses: any[] = [];
  isEditMode: boolean = false;
  addressToEdit: any = null;

  constructor(private addressService: AddressService, private toastr:ToastrServiceWrapper) {}

  ngOnInit(): void {
    // Fetch saved addresses when the component is initialized
    this.addressService.getSavedAddresses().subscribe(
      (addresses) => {
        this.savedAddresses = addresses;
      },
      (error) => {
        console.error('Error fetching saved addresses:', error);
        this.toastr.error('Failed to fetch saved address', 'Error');

      }
    );
  }

  // Save or update an address
  saveAddress(): void {
    if (this.isEditMode && this.addressToEdit) {
      // Update the existing address if in edit mode
      this.addressService.updateAddress(this.address).subscribe(
        (updatedAddress) => {
          const index = this.savedAddresses.findIndex((addr) => addr.AddressID === updatedAddress.AddressID);
          if (index !== -1) {
            this.savedAddresses[index] = updatedAddress; // Update the list
          }
          this.resetAddressForm();
        },
        (error) => {
          console.error('Error updating address:', error);
          this.toastr.error('Failed to update your address', 'Error');

        }
      );
    } else {
      // Add a new address if not in edit mode
      this.addressService.addAddress(this.address).subscribe(
        (newAddress) => {
          this.savedAddresses.push(newAddress); // Add the new address to the list
          this.resetAddressForm();
        },
        (error) => {
          console.error('Error adding address:', error);
          this.toastr.error('Failed to Add your address', 'Error');

        }
      );
    }
  }

  // Reset the address form
  resetAddressForm(): void {
    this.address = {
      street: '',
      phone: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    };
    this.isEditMode = false;
    this.addressToEdit = null;
  }

  // Remove an address
  removeAddress(address: any): void {
    this.addressService.removeAddress(address).subscribe(
      () => {
        this.savedAddresses = this.savedAddresses.filter((addr) => addr.AddressID !== address.AddressID);
      },
      (error) => {
        console.error('Error removing address:', error);
      }
    );
  }

  // Set the form to edit mode and populate with the selected address
  editAddress(address: any): void {
    this.address = { ...address }; // Clone the address to avoid direct mutation
    this.isEditMode = true;
    this.addressToEdit = address;
  }
}

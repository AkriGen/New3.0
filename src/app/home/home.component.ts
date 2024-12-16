import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import * as AOS from 'aos';
import { Router } from '@angular/router';
import { AutharizeService } from '../services/autharize.service';
import { Product } from '../product.model';
import { ToastrServiceWrapper } from '../toastr.service';

@Component({
  selector: 'app-home',
  standalone: false,
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  bestSellers: Product[] = [];
  showPopup: boolean = false;  // To control showing the popup
  isLoggedIn:boolean=false;
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router:Router,
    private authService:AutharizeService,
     private toastr: ToastrServiceWrapper  // Inject toastr service
    
  ) {
    this.checkRemindTime();  // Check if the popup should be displayed based on the remind time


  }
  logOut = () => {
    this.authService.logout();
  }
  // Check if the popup should be shown based on "Remind Me Later" time
  checkRemindTime() {
    // Skip popup if user is logged in
    if (this.isLoggedIn) {
      this.showPopup = false;
      return;  // Skip further logic if logged in
    }

    const remindTime = sessionStorage.getItem('remindTime');
    if (remindTime) {
      const currentTime = new Date().getTime();
      if (currentTime >= parseInt(remindTime)) {
        this.showPopup = true;  // Show the popup again after 1 minute
      }
    } else {
      this.showPopup = true;  // Show popup immediately if it's the first time
    }
  }


  // Close the popup when the user closes it
  closePopup() {
    this.showPopup = false;
  }

  // Handle the "Remind Me Later" event when the user clicks "Remind Me Later"
  remindLater() {
    this.showPopup = false;  // Close the popup after reminding the user
    // Save the remind time in localStorage (e.g., 1 minute from now)
    const remindTime = new Date().getTime() + 20000;  // 1 minute later
    localStorage.setItem('remindTime', remindTime.toString());
  }

  ngOnInit(): void {
     // Show the popup after 20 seconds, only if the user is not authenticated
     this.authService.loginStatus$.subscribe((status) => {
      this.isLoggedIn = status;
    });
     
     
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
        console.log(data)
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.toastr.error('Failed to load products', 'Error');

      }
    );
    this.bestSellers = [...this.products]  // Make a copy of the products
      .sort(() => 0.5 - Math.random()) // Randomize the products
      .slice(0, 2); // Get first 3 random products
    AOS.init();  
     }
     addToCart(product: Product) {
      if (product && product.ProductId) {
        this.cartService.addToCart(product);
        this.toastr.success(`${product.ProductName} added to cart!`);  // Show success toast
  
       
      } else {
        console.error('Invalid product:', product);
        this.toastr.error('Failed to add product to cart', 'Error');
  
      }
    }
  
    buyNow(product: Product) {
      if (product.StockQuantity > 0) {
        this.cartService.addToCart(product);
        this.router.navigate(['/payment']);
      } else {
        this.toastr.warning(`${product.ProductName} is out of stock!`, 'Out of Stock');
  
      }
    }
    onButtonClick(product:Product) {
      if (this.isLoggedIn) {
        // If authenticated, call the addingCart method
        this.addToCart(product);
      } else {
        // If not authenticated, redirect to login
        this.router.navigate(['userlogin']);
      }
    }
   
  

}

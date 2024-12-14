import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { Product } from '../product.model';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: { product: Product; quantity: number }[] = [];  // Specify the type for cart items
  cartTotal: number = 0;

  constructor(public cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();  // Initialize cart on component load
  }

  // Method to load cart items and total
  loadCart() {
    this.cartItems = this.cartService.getCartItems();
    this.cartTotal = this.cartService.getCartTotal();
  }

  // Update item quantity (+ or -) in the cart
  updateQuantity(productId: number, change: number) {
    const product = this.cartItems.find(item => item.product.ProductId === productId);
    if (product) {
      const newQuantity = product.quantity + change;
      if (newQuantity >= 1) {
        this.cartService.updateQuantity(productId, newQuantity); // Update quantity in cart service
        this.loadCart();  // Reload cart items and total after update
      }
    }
  }

  // Remove an item from the cart
  removeItem(productId: number) {
    this.cartService.removeItem(productId); // Call removeItem method from CartService
    this.loadCart();  // Reload cart after removing an item
  }

  // Navigate to the payment page
  proceedToPayment() {
    this.router.navigate(['/payment']);  // Navigate to the payment page
  }

  // Clear all items in the cart
  clearCart() {
    this.cartService.clearCart();  // Call the clearCart method from CartService
    this.loadCart();  // Reload cart after clearing
  }
}

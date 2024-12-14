import { Injectable } from '@angular/core';

export interface Product {
  ProductId: number;
  ProductName: string;
  ProductImage: string;
  Price: number;
  Description: string;
  StockQuantity: number;
  CategoryId: number;
  category: 'skin' | 'immunity' | 'digestion' | 'body' | 'hair';
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems: { product: Product; quantity: number }[] = [];

  constructor() {
    // Try to load cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
    }
  }

  addToCart(product: Product) {
    if (!product || !product.ProductId) {
      console.error('Invalid product:', product); // Log the invalid product
      return; // Exit if product is invalid
    }
  
    const existingProduct = this.cartItems.find(item => item.product.ProductId === product.ProductId);
    
    // Check if product exists in the cart
    if (existingProduct) {
      // Check if quantity can be increased without exceeding stock
      if (existingProduct.quantity < product.StockQuantity) {
        existingProduct.quantity++;
      } else {
        // Notify user if out of stock
        alert(`Sorry, only ${product.StockQuantity} left in stock.`);
      }
    } else {
      // Add product to cart only if stock is available
      if (product.StockQuantity > 0) {
        this.cartItems.push({ product, quantity: 1 });
      } else {
        alert('Out of stock!');
      }
    }
  
    this.saveCart(); // Save cart after adding/updating
  }
  

  // Method to get the current cart items
  getCartItems() {
    return this.cartItems;
  }

  // Update the quantity of a product in the cart
  updateQuantity(productId: number, quantity: number) {
    const product = this.cartItems.find(item => item.product.ProductId === productId);
  
    if (product) {
      // Ensure quantity does not exceed stock
      if (quantity > product.product.StockQuantity) {
        alert(`Cannot update quantity. Stock is insufficient! Only ${product.product.StockQuantity} left.`);
      } else if (quantity >= 1) {
        product.quantity = quantity;
        this.saveCart();  // Save cart after updating
      }
    }
  }

  // Method to save the cart to localStorage
  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));  // Save to localStorage
  }

  // Remove a product from the cart
  removeItem(productId: number) {
    this.cartItems = this.cartItems.filter(item => item.product.ProductId !== productId);
    this.saveCart();  // Save after removing the item
  }

  // Get the total cost of items in the cart
  getCartTotal() {
    return this.cartItems.reduce((total, item) => total + item.product.Price * item.quantity, 0);
  }

  // Clear all items in the cart
  clearCart() {
    this.cartItems = [];
    this.saveCart();  // Save after clearing
  }
}

import { Component, OnInit } from '@angular/core';
import { Product } from '../../product.model';
import { FilterService } from '../../services/filter.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { ToastrServiceWrapper } from '../../toastr.service';

@Component({
  selector: 'app-body',
  standalone: false,
  
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent implements OnInit{
  products: Product[] = [];

  constructor(private filterService: FilterService, public cartService:CartService, private router:Router,    private toastr: ToastrServiceWrapper ) { }

  ngOnInit(): void {
    this.fetchProducts(3);  // Assuming '1' is the categoryId for Skin
  }

  fetchProducts(categoryId: number): void {
    this.filterService.getProductsByCategory(categoryId).subscribe(data => {
      this.products = data;
    });
  }
  // Add product to the cart
  addToCart(product: Product) {
    if (product && product.ProductId) {  // Check if product is valid
      this.cartService.addToCart(product);
      this.toastr.success(`${product.ProductName} added to cart!`);  // Show success toast
    } else {
      this.toastr.error('Invalid product', 'Error');

    }
  }
  

  // Buy product immediately and proceed to payment
  buyNow(product: Product) {
    // Check if the product is in stock
    if (product.StockQuantity > 0) {
      this.cartService.addToCart(product);
      // Navigate to the payment page
      this.router.navigate(['/payment']);
    } else {
      this.toastr.warning(`${product.ProductName} is out of stock!`, 'Out of Stock');
    }
  }


}

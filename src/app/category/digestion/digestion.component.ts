import { Component, OnInit } from '@angular/core';
import { Product } from '../../product.model';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { FilterService } from '../../services/filter.service';
import { ToastrServiceWrapper } from '../../toastr.service';

@Component({
  selector: 'app-digestion',
  standalone: false,
  
  templateUrl: './digestion.component.html',
  styleUrl: './digestion.component.css'
})
export class DigestionComponent implements OnInit{
  products: Product[] = [];

  constructor(private filterService: FilterService, private toastr: ToastrServiceWrapper, public cartService:CartService, private router:Router) { }

  ngOnInit(): void {
    this.fetchProducts(5);  // Assuming '5' is the categoryId for digestion
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
      alert(`${product.ProductName} added to cart!`);
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

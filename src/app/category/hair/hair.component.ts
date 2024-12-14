import { Component, OnInit } from '@angular/core';
import { Product } from '../../product.model';
import { FilterService } from '../../services/filter.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hair',
  standalone: false,
  
  templateUrl: './hair.component.html',
  styleUrl: './hair.component.css'
})
export class HairComponent implements OnInit {
  products: Product[] = [];

  constructor(private filterService: FilterService, public cartService:CartService, private router:Router) { }

  ngOnInit(): void {
    this.fetchProducts(1);  // Assuming '1' is the categoryId for hair
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
      console.error('Invalid product:', product); // Log if the product is invalid
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
      alert(`${product.ProductName} is out of stock.`);
    }
  }


}

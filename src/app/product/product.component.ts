import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { Product } from '../product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  imports:[CommonModule],
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch products from backend
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
        console.log(data)
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  addToCart(product: Product) {
    if (product && product.ProductId) {
      this.cartService.addToCart(product);
      alert(`${product.ProductName} added to cart!`);
    } else {
      console.error('Invalid product:', product);
    }
  }

  buyNow(product: Product) {
    if (product.StockQuantity > 0) {
      this.cartService.addToCart(product);
      this.router.navigate(['/payment']);
    } else {
      alert(`${product.ProductName} is out of stock.`);
    }
  }
}

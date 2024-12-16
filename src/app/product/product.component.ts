import { Component, Inject, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { Product } from '../product.model';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ToastrServiceWrapper } from '../toastr.service';


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
    private router: Router,
    private toastr: ToastrServiceWrapper  // Inject toastr service

  ) {}

  ngOnInit(): void {
    // Fetch products from backend
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
        console.log(data)
      },
      (error) => {
        this.toastr.error('Failed to load products', 'Error');

      }
    );
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
}
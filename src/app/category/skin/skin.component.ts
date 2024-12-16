import { Component, OnInit } from '@angular/core';
import { Product } from '../../product.model';
import { FilterService } from '../../services/filter.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { ToastrServiceWrapper } from '../../toastr.service';

@Component({
  selector: 'app-skin',
  standalone: false,
  
  templateUrl: './skin.component.html',
  styleUrl: './skin.component.css'
})
export class SkinComponent implements OnInit{
  products: Product[] = [];

  constructor(private filterService: FilterService, private toastr: ToastrServiceWrapper, public cartService:CartService, private router:Router) { }

  ngOnInit(): void {
    this.fetchProducts(2);  // Assuming '1' is the categoryId for Skin
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

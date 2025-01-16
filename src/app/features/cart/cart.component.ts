import { Component, OnInit } from '@angular/core';
import { CartService } from '../../shared/service/cart.service';
import { CartItem } from '../../shared/Models/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal = 0;
  hoveredItem: number | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
    this.cartService.cart$.subscribe(cart => {
      this.cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    });
  }

  toggleCart() {
    const cartOverlay = document.getElementById('cart');
    if (cartOverlay) cartOverlay.classList.toggle('open');
  }

  confirmRemoveItem(index: number) {
    const confirmed = confirm('Are you sure you want to remove this item from the cart?');
    if (confirmed) {
      this.removeCartItem(index);
    }
  }

  removeCartItem(index: number) {
    this.cartService.removeCartItem(index); // Chiama il metodo del servizio
    this.cartItems = this.cartService.getCartItems();
    this.cartTotal = this.cartService.getCartTotal();
  }

  plusItem(index: number) {
    this.cartService.plusCartItem(index);
    this.cartItems = this.cartService.getCartItems();
    this.cartTotal = this.cartService.getCartTotal();
  }

  minusItem(index: number) {
    this.cartService.minusCartItem(index);
    this.cartItems = this.cartService.getCartItems();
    this.cartTotal = this.cartService.getCartTotal();
  }
}
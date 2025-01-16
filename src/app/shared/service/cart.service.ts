import { Injectable } from '@angular/core';
import { CartItem } from '../Models/cart';
import { Product } from '../Models/products';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: CartItem[] = [];

  private cartSubject = new BehaviorSubject<CartItem[]>(this.cart);
  cart$ = this.cartSubject.asObservable();

  getCartItems() {
    const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    const cartData: CartItem[] = JSON.parse(savedCart);
    this.cart = cartData;
    this.cartSubject.next(this.cart);
  }
  return this.cart;
  }

  getCartTotal() {
    return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getCartCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  addCartItem(product: Product) {
    const existingCartItem = this.cart.find(item => item.name === product.name);
  
    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      const newCartItem: CartItem = {
        name: product.name,
        quantity: 1,
        price: product.listPrice,
      };
      this.cart.push(newCartItem);
    }

    const cartData = this.cart.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));
    localStorage.setItem('cart', JSON.stringify(cartData));

    this.cartSubject.next(this.cart);
  }

  removeCartItem(index: number) {
    if (index > -1 && index < this.cart.length) {
      this.cart.splice(index, 1);
    }
    this.cartSubject.next(this.cart);

    const cartData = this.cart.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));
    
    localStorage.setItem('cart', JSON.stringify(cartData));
  }

  plusCartItem(index: number) {
    this.cart[index].quantity ++;
    this.cartSubject.next(this.cart);
    const cartData = this.cart.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));
    
    localStorage.setItem('cart', JSON.stringify(cartData));
  }

  minusCartItem(index: number) {
    if(this.cart[index].quantity == 1) {
      const confirmed = confirm('Are you sure you want to remove this item from the cart?');
      if (confirmed) {
        this.removeCartItem(index);
      }
    } else {
      this.cart[index].quantity --;
    }
    this.cartSubject.next(this.cart);

    const cartData = this.cart.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));
    
    localStorage.setItem('cart', JSON.stringify(cartData));
  }
}
import { Component,Input } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { Product } from '../../Models/products';
import { AuthService } from '../../authentication/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.css'
})
export class ProductModalComponent {

  constructor(
    public cart: CartService,
    public auth: AuthService,
  ){}
  @Input() isProductAdded: boolean = false;
  @Input() selectedProduct!:Product;


   //Metodo per aggiungere un prodotto al carrello
   addToCart(product: Product) {
    this.cart.addCartItem(product);
    this.isProductAdded = true;
    setTimeout(() => {
      this.isProductAdded = false;
    }, 1000);
  }

}

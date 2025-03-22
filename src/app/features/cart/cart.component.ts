import { Component, OnInit,OnDestroy } from '@angular/core';
import { CartService } from '../../shared/service/cart.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';
// import { CartItem } from '../../shared/Models/cart';
import { CommonModule } from '@angular/common';
import { userCart } from '../../shared/Models/userCart';
import { LoggedUserService } from '../../core/login/service/loggedUser.service';
import { LoggedUser } from '../../core/interfaces/loggedUser-interface';
import { SessionModalComponent } from '../../shared/components/session-modal/session-modal/session-modal.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,SessionModalComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: userCart[] = [];
  cartTotal = 0;
  hoveredItem: number | null = null;
  user : LoggedUser |null = null;
  // Per annullare le sottoscrizioni
  private unsubscribe$ = new Subject<void>();

  constructor(
    // Iscrizioni ai servizi
    private cartService: CartService,
    private loggedUserService : LoggedUserService
  ) {}

  ngOnInit() {
    //Iscrizione al servizio cartService(e gestita disicrizione)
    this.cartService.cart$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(cart => {
      this.cartTotal = cart.reduce((total, item) => total + item.unitPrice * item.orderQty, 0);
    });
    //Recupero l'utente loggato
    this.loggedUserService.user$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(user =>{
      //Aspetto che user sia popolato prima di eseguire la chiamata
      this.user = user;
      if(user){
        // recupero i prodotti nel carrello
        this.cartService.getCartItems(user.id).subscribe(cart=>{
          this.cartItems = cart;
        })
      }
    })
  }

  //Metodo per mostrare o nascondere il carrello
  toggleCart() {
    const cartOverlay = document.getElementById('cart');
    if (cartOverlay) cartOverlay.classList.toggle('open');
  }

  // Metodo per rimuovere un prodotto dal carrello
  removeCartItem(productId: number) {
    this.cartService.removeCartItem(productId);
    this.cartTotal = this.cartService.getCartTotal();
  }

  // Metodo per aggiungere la quantità di un prodotto
  plusItem(productId: number) {
    this.cartService.plusCartItem(productId);
    // Dopo l'aggiornamento, ricarico i dati dal backend per garantire coerenza
    this.cartService.getCartItems(this.user?.id ?? 0)
  .subscribe(cart => {
    // Assegna i dati quando vengono ricevuti
    this.cartItems = cart;  
  });
    this.cartTotal = this.cartService.getCartTotal();
  }

  // Metodo rimuovere la quantità di un prodotto
  minusItem(productId:number) {
    this.cartService.minusCartItem(productId)
    this.cartService.getCartItems(this.user?.id ?? 0)
  .subscribe(cart => {
    // Assegna i dati quando vengono ricevuti
    this.cartItems = cart;  
  });
    this.cartTotal = this.cartService.getCartTotal();
  }

  ngOnDestroy(){
    // Chiude tutte le sottoscrizioni quando il componente viene distrutto
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
import { Injectable } from '@angular/core';
// import { CartItem } from '../Models/cart';
import { Product } from '../Models/products';
import { BehaviorSubject, Observable,of,tap} from 'rxjs';
import { userCart } from '../Models/userCart';
import { CartHttpService } from '../httpservices/carthttp.service';
import { LoggedUserService } from '../../core/login/service/loggedUser.service';
import { LoggedUser } from '../../core/interfaces/loggedUser-interface';
import { ModalSessionService } from './modal-session.service';


@Injectable({
  providedIn: 'root',
})
export class CartService{
  private cart: userCart[] = [];
  private cartSubject = new BehaviorSubject<userCart[]>(this.cart);
  cart$ = this.cartSubject.asObservable();
  user : LoggedUser |null = null;
  
  //Costruttore
  constructor(
    //Servizio per le richieste http
    private httpRequest : CartHttpService,
    private loggedUserService : LoggedUserService,
    private modalService: ModalSessionService
  ){
    // Recupero l'utente loggato al momento della creazione del servizio
    this.loggedUserService.user$.subscribe(user => {
      console.log('Utente loggato:', user);
      this.user = user;
    });
  };

  //Metodo per recuperare il carrello dell'utente 
  getCartItems(id: number): Observable<userCart[]> {
      return this.httpRequest.getCartItems(id).pipe(
        tap(data =>{
          console.log(data);
          this.cart = data;
          // Aggiorna lo stato del carrello
          this.cartSubject.next(this.cart);
        })
      );
  }

  //Metodo per calcolare il totale del carrello
  getCartTotal() {
    if(!this.cart.length){
      return 0;
    }
    return this.cart.reduce((total, item) => total + 
    (item?.unitPrice ?? 0) * (item?.orderQty ?? 0), 0);
  }

  getCartCount() {
    return this.cart.reduce((count, item) => count + item.orderQty, 0);
  }

  //Metodo per aggiungere un prodotto al carrello
  addCartItem(product: Product) {
    console.log(this.cart);
    // Controllo se il prodotto è già presente nel carrello
    const existingCartItem = this.cart.find(item => item.name === product.name);
    // Se è gia presente aumento la quantità
    if (existingCartItem) {
      existingCartItem.orderQty += 1;
    } 
    //Altrimenti aggiungo un nuovo prodotto
    else {
      const newCartItem: userCart = {
        customerId : this.user?.id ?? 0,
        name: product.name,
        orderQty : 1,
        productId :  product.productId,
        unitPrice : product.listPrice,
        addedAt : new Date().toISOString(),
      };
      this.cart.push(newCartItem);
      //Aggiungo il carrello dell'utente al database
      this.httpRequest.addProductToCart(newCartItem).subscribe({
        next:(response)=>{
          console.log('Carrello aggiornato nel database', response);
        },
        error:(err)=>{
          console.error('Errore durante il salvataggio del carrello', err);
          if(err.status === 401){
            this.modalService.openModal();
          }
        }
      });
    }
    //Aggiorno lostato del carrello
    this.cartSubject.next(this.cart);
  }

  // Metodo per rimuovere un prodotto dal carrello
  removeCartItem(productId: number) {
    this.httpRequest.deleteCartItems(productId).subscribe({
      next:(response)=>{
        //Trovo l'indice dell'elemento nel carrello
        const index = this.cart.findIndex(item=> item.productId === productId);
        if(index !== -1){
          //Rimuove l'elemento dall'array del carrello
          this.cart.splice(index,1);
          //Aggiorno lo stato del carrello
          this.cartSubject.next(...[this.cart]);
        }
      },
      error: (err) => {
        console.error('Errore durante la rimozione del prodotto dal carrello', err);
        if(err.status === 401){
          this.modalService.openModal();
        }
      }
    })
  }

  // Metodo per aggiungere la quantità di un prodotto
  plusCartItem(productId: number) {
    // Aumento quantità del prodotto nel DB
    this.httpRequest.increaseCartItem(productId).subscribe({
      next:(updatedCartItem)=>{
        // Trova il prodotto nel carrello e aggiorna la quantità basata sulla risposta del backend
        const index = this.cart.findIndex(item=> item.productId === productId);
        if(index !== -1){
          //Aggiorno il prodotto con la quantità aggiornata
          this.cart[index] = updatedCartItem;
        }
         // Aggiorna lo stato del carrello con il valore corretto del backend
         this.cartSubject.next([...this.cart]);// Usa lo spread operator per forzare l'aggiornamento
      },
      error:(err)=>{
        if(err.status === 401){
          this.modalService.openModal();
        }
        console.error('Errore durante aggiornamento quantità del carrello', err);
      }
    })
  }

  // Metodo rimuovere la quantità di un prodotto
  minusCartItem(productId:number) {
    this.httpRequest.decreaseCartItems(productId).subscribe({
      next:(response)=>{
        const index = this.cart.findIndex(item=> item.productId === productId);
        if(index !== -1){
          if(response.removed){
            //Se il flag removed è true,rimuovo l'elemento dal carrello
            this.cart.splice(index,1)
          }else{
              // Aggiorno l'elemento con i nuovi dati
            this.cart[index]=response;
          }
        }
        // Aggiorno lo stato del carrello con il valore corretto del backend
        this.cartSubject.next([...this.cart]);
      },
      error: (err) => {
        if(err.status === 401){
          this.modalService.openModal();
        }
        console.error('Errore durante l’aggiornamento della quantità del carrello', err);
      }
    })
  }

  //Metodo per aggiornare il dettaglio del carrello
  updateCartData(){
    const cartData = this.cart.map(item => ({
      customerId : item.customerId,
      name: item.name,
      orderQty : item.orderQty,
      productId :  item.productId,
      unitPrice : item.unitPrice,
      addedAt : item.addedAt,
    }));
    return cartData;
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { Observable } from 'rxjs';
import { userCart } from '../Models/userCart';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartHttpService {

  constructor(private http : HttpClient,private auth: AuthService) { }

  //Funzione per recuperare il carrello dell'utente
  getCartItems(id:number): Observable <userCart[]>{
     // Recupero il token JWT dal localStorage
     const jwtToken = localStorage.getItem('jwtToken');
     // Imposto gli headers con il token
     const headers = new HttpHeaders({
     'Authorization': `Bearer ${jwtToken}`,
     'Content-Type': 'application/json', 
     });
    return this.http.get<userCart[]>(`https://localhost:7257/api/Orders/${id}`,
      {headers}
    )
  }

  //Funzione per salvare nel carrello dell'utente nel DB
  addProductToCart(userCart: userCart): Observable<userCart>{
     // Recupero il token JWT dal localStorage
     const jwtToken = localStorage.getItem('jwtToken');
     // Imposto gli headers con il token
     const headers = new HttpHeaders({
     'Authorization': `Bearer ${jwtToken}`,
     'Content-Type': 'application/json', 
     });
    return this.http.post<userCart>('https://localhost:7257/api/Orders',
      userCart,{headers})
  }

  // Funzione per aumentare la quantità del prodotto nel DB
  increaseCartItem(productId: number): Observable<userCart>{
     // Recupero il token JWT dal localStorage
    const jwtToken = localStorage.getItem('jwtToken');
    //Imposto gli headers con il token
    const headers = new HttpHeaders({
      'Authorization':`Bearer ${jwtToken}`,
      'Content-Type':'application/json',
    });
    return this.http.put<userCart>(
      `https://localhost:7257/api/Orders/increase/${productId}`,
      {},
      {headers}
    )
  }

  // Funzione per ridurre la quantità del prodotto nel DB
  decreaseCartItems(productId:number): Observable <any>{
     // Recupero il token JWT dal localStorage
     const jwtToken = localStorage.getItem('jwtToken');
     //Imposto gli headers con il token
     const headers = new HttpHeaders({
       'Authorization':`Bearer ${jwtToken}`,
       'Content-Type':'application/json',
     });
     return this.http.put<userCart>(`https://localhost:7257/api/Orders/decrease/${productId}`,
      {},
      {headers}
     )
  }

  //Funzione per eliminare un prodotto dal carrello
  deleteCartItems(productId:number): Observable<void>{
     // Recupero il token JWT dal localStorage
     const jwtToken = localStorage.getItem('jwtToken');
     //Imposto gli headers con il token
     const headers = new HttpHeaders({
       'Authorization':`Bearer ${jwtToken}`,
       'Content-Type':'application/json',
     });
    return this.http.delete<void>(`https://localhost:7257/api/Orders/delete/${productId}`,
      {headers}
    )
  }

  //!   Avevi creato il componente product modal nel componente bike
  //!   controlla che sia tutto ok e fallo anche negli altri componenti
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggedUserService {
  private userSubject = new BehaviorSubject<any>(null); 
  user$ = this.userSubject.asObservable(); 

  // Metodo per aggiornare i dati dell'utente
  setUser(userData: any) {
    this.userSubject.next(userData);
  }

  // Metodo per ottenere l'utente corrente
  getUser() {
    return this.userSubject.getValue();
  }
}

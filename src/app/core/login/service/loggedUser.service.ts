import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoggedUser } from '../../interfaces/loggedUser-interface';

@Injectable({
  providedIn: 'root'
})
export class LoggedUserService {
  //Acceta o un interfaccia loggeUser o null
  private userSubject = new BehaviorSubject<LoggedUser|null>(null); 
  user$ = this.userSubject.asObservable(); 

  // Metodo per aggiornare i dati dell'utente
  setLoggedUser(userData: LoggedUser| null) {
    this.userSubject.next(userData);
  }

  // Metodo per ottenere l'utente corrente
  getUser() {
    return this.userSubject.getValue();
  }
}

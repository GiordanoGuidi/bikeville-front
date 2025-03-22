import { Injectable } from '@angular/core';
import { BehaviorSubject,Observable } from 'rxjs';
import { LoggedUser } from '../../interfaces/loggedUser-interface';

@Injectable({
  providedIn: 'root'
})
export class LoggedUserService {
  //Acceta o un interfaccia loggeUser o null
  private userSubject = new BehaviorSubject<LoggedUser|null>(null); 
  // Espone user$ per l'uso nei componenti
  user$ = this.userSubject.asObservable();

  constructor(){
    // Se esiste un token nel localStorage, ripopola il BehaviorSubject
    const userData = localStorage.getItem('loggedUser');
    if(userData){
      this.userSubject.next(JSON.parse(userData));
    }
  }


  // Metodo per aggiornare i dati dell'utente
  setLoggedUser(userData: LoggedUser | null) {
    if (userData) {
      // Salvo i dati utente nel localStorage
      localStorage.setItem('loggedUser', JSON.stringify(userData));
    } else {
      // Rimuovo i dati utente se null
      localStorage.removeItem('loggedUser');
    }
    this.userSubject.next(userData);
  }

  // Metodo per ottenere l'utente corrente
  getUser(): Observable<LoggedUser | null> {
    return this.userSubject.asObservable();
  }
}

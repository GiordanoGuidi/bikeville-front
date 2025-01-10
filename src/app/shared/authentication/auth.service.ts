import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Credentials, LoginComponent } from '../../core/login/login.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLogged = false;

  //Creo istanza della classe HttpHeaders
  authenticationJwtHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    responseType: 'text',
  });

  //DI del servizio HttpClient
  constructor(private http: HttpClient) {
    // Controllo se il login è persistito al caricamento
    this.loadLoginState();
  }
  
  //Richiesta post al backend(Controller Login)
  LoginJwtPost(credentials: Credentials): Observable<any> {
    return this.http.post('https://localhost:7257/LoginJwt', credentials, {
      observe: 'response',
    });
  }

  //Metodo per gestire il token e l'intestazione della richiesta http al login e al logout
  SetLoginJwtInfo(isLogged: boolean, jwtToken: string = '') {
    if (isLogged) {
      //Salvo nel localstorege il token e lo stato di login
      localStorage.setItem('jwtToken', jwtToken);
      localStorage.setItem('isLogged', JSON.stringify(true));
      //Modifico l'intestazione della richiesta http
      this.authenticationJwtHeader = this.authenticationJwtHeader.set(
        'Authorization',
        'Bearer ' + jwtToken
      );
      this.isLogged = isLogged;
    }
    else
    {
      //Rimuovo i dati dal localStorage
      localStorage.removeItem('jwtToken');
      localStorage.setItem('isLogged', JSON.stringify(false));
      //Resetta l'intestazione
      this.authenticationJwtHeader = new HttpHeaders({
        'Content-Type': 'application/json',
        responseType: 'text',
      });
    }

    this.isLogged = isLogged;
  }

  GetLoginInfo(): boolean {
    return this.isLogged;
  }

  // Metodo per caricare lo stato di login
  private loadLoginState(): void {
    const storedIsLogged = localStorage.getItem('isLogged');

    if (storedIsLogged && JSON.parse(storedIsLogged)) {
      this.isLogged = true;
    }
  }
}

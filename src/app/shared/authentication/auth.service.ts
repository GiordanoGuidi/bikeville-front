import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Credentials, LoginComponent } from '../../core/login/login.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLogged = false;
  private isAdmin = false;

  //Creo istanza della classe HttpHeaders
  authenticationJwtHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    responseType: 'text',
  });

  //DI del servizio HttpClient
  constructor(private http: HttpClient) {}
  
  //Richiesta post al backend(Controller Login)
  LoginJwtPost(credentials: Credentials): Observable<any> {
    return this.http.post('https://localhost:7257/LoginJwt', credentials, {
      observe: 'response',
    });
  }

  //Metodo per gestire il token e l'intestazione della richiesta http al login e al logout
  SetLoginJwtInfo(isLogged: boolean, jwtToken: string = '') {
    if (isLogged) {
      //Salvo nel localstorege il token
      localStorage.setItem('jwtToken', jwtToken);
      //Modifico l'intestazione della richiesta http
      this.authenticationJwtHeader = this.authenticationJwtHeader.set(
        'Authorization',
        'Bearer ' + jwtToken
      );
      console.log('DOpo imposta Header ' + JSON.stringify(this.authenticationJwtHeader))
    this.isLogged = isLogged;
      
    }
    else
    {
      //Rimuovo il token dal localSorage
      localStorage.removeItem('jwtToken');
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

  GetAdminInfo(): boolean {
    return this.isAdmin;
  }

  async adminCheck(email: string): Promise<boolean> {
    try {
      const response = await fetch("https://localhost:7257/LoginJwt/admin/" + email, {
        method: "POST",
        body: JSON.stringify({email: email}),
        headers: {
        "Content-Type": "application/json"
        }
      });

      if(!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      const result: boolean = await response.json();

      this.isAdmin = true;
      return true;
    } catch (error) {
      console.error("Errore nella fetch:", error);
      this.isAdmin = false;
      return false;
    }
  }
}

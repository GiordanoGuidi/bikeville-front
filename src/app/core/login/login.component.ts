import { Component,OnInit } from '@angular/core';
import { AuthService } from '../../shared/authentication/auth.service';
import { HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
/*Importo una libreria che permette di decodificare un JWT lato client*/
import * as jwt_decode from 'jwt-decode';
import { HtmlParser } from '@angular/compiler';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  //DI del servizio AuthService
  constructor(private authentication: AuthService,private router: Router) {}
  loginCredentials: Credentials = new Credentials();
  jwtToken: any;
  decodedTokenPayload: any;
  //Flag per mostrare il form di login
  isLoginOpen: boolean = true;
  userEmail: string = '';
  userPassword: string = '';
  
  async verifyMail(EmailAddress: string): Promise<boolean> {
    try {
      const response = await fetch("https://localhost:7257/user/" + EmailAddress);
      
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
  
      const result: boolean = await response.json();
  
      // Inverti il valore booleano e restituisci
      return result;
    } catch (error) {
      console.error("Errore nella fetch:", error);
      // Se c'è un errore, restituisci un valore di default, ad esempio `false`
      return false;
    }
  }

  async RunLoginJwt(eml: string, pwd: string): Promise<void> {
    const isEmailRegistered = await this.verifyMail(this.userEmail);
    if (!isEmailRegistered) {
      alert('Email non registrata. Per favore, registrati prima di effettuare il login.');
      return;
    }
    if (eml && pwd) {
      this.loginCredentials.Email = eml;
      this.loginCredentials.Password = pwd;
      //Passo le credenziali dell'utente come parametri del metodo LoginJwtPosts
      this.authentication.LoginJwtPost(this.loginCredentials).subscribe({
        next: (response: any) => {
          switch (response.status) {
            case HttpStatusCode.Ok:
              console.log('Login effettuato ');
              //Assegno il valore recuperato dal body della response
              this.jwtToken = response.body.token;
              //Assegno il token  e il booleano al metodo 
              this.authentication.SetLoginJwtInfo(true, this.jwtToken);
              /*Decodifica la stringa del token e restituisce un oggetto JSON
              che rappresenta il payload del toke */
              this.decodedTokenPayload = jwt_decode.jwtDecode(this.jwtToken);
              //Imposto la flag a false per far sparire il form di login
              this.isLoginOpen = false;
              console.log(this.decodedTokenPayload);
              console.log(this.decodedTokenPayload.unique_name);
              console.log(this.decodedTokenPayload.iss);
              console.log(this.decodedTokenPayload.aud);
              console.log(this.decodedTokenPayload.exp);
              break;
            case HttpStatusCode.NoContent:
              console.log('Senza risposta');
              break;
          }
        },
        error: (err: any) => {
          switch (err.status) {
            case HttpStatusCode.Unauthorized:
              this.authentication.SetLoginJwtInfo(false,this.jwtToken);
              alert('Username o Password errati');
              break;
          }
        },
      });
    } else {
      alert('Username e Password sono campi obbligatori');
    }
  }
}

export class Credentials {
  Email: string = '';
  Password: string = '';
}
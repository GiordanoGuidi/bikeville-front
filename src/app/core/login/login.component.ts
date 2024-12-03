import { Component,OnInit } from '@angular/core';
import {AuthService} from '../../shared/authentication/auth.service';
import {HttpStatusCode} from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
/*Importo una libreria che permette di decodificare un JWT lato client*/
import * as jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
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
  

  RunLoginJwt(eml: HTMLInputElement, pwd: HTMLInputElement) {
    if (eml.value && pwd.value) {
      this.loginCredentials.Email = eml.value;
      this.loginCredentials.Password = pwd.value;
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
  Email: string;
  Password: string;
  constructor() {
    this.Email = '';
    this.Password = '';
  }
}
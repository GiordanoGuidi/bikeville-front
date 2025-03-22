import { Component,OnInit } from '@angular/core';
import { AuthService } from '../../shared/authentication/auth.service';
import { HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
/*Importo una libreria che permette di decodificare un JWT lato client*/
import * as jwt_decode from 'jwt-decode';
import { HtmlParser } from '@angular/compiler';
import { LoggedUserService } from './service/loggedUser.service';
import { LoggedUser } from '../interfaces/loggedUser-interface';
import { AlertService } from '../../shared/service/alert.service';
import { AlertComponent } from '../../shared/components/alert/alert/alert.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,AlertComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  //DI del servizio AuthService
  constructor(
    private authentication: AuthService,
    private router: Router,
    private loggedUserService:LoggedUserService,
    private alertService:AlertService,
  ) {}
  loginCredentials: Credentials = new Credentials();
  jwtToken: any;
  decodedTokenPayload: any;
  //Flag per mostrare il form di login
  isLoginOpen: boolean = true;
  userEmail: string = '';
  userPassword: string = '';
  showAlert = false;
  
  
  async verifyMail(EmailAddress: string): Promise<boolean> {
    try {
      const response = await fetch("https://localhost:7257/user/" + EmailAddress);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const result: boolean = await response.json();
      // Inverti il valore booleano e restituisci
      return result;
    } catch (error) {
      console.error("Fetch error:", error);
      // Se c'è un errore, restituisci un valore di default, ad esempio `false`
      return false;
    }
  }

  async RunLoginJwt(eml: string, pwd: string): Promise<void> {
    const isEmailRegistered = await this.verifyMail(this.userEmail);
    if (!isEmailRegistered) {
      this.alertService.showAlert('Incorrect email or password', 'error');
      return;
    }
    if (eml && pwd) {
      //Aggiungo il valore alle credenziali
      this.loginCredentials.Email = eml;
      this.loginCredentials.Password = pwd;
      //Passo le credenziali dell'utente come parametri del metodo LoginJwtPosts
      this.authentication.LoginJwtPost(this.loginCredentials).subscribe({
        next: (response: any) => {
          switch (response.status) {
            case HttpStatusCode.Ok:
              //Mostro l'alert tramite il servizio
              this.alertService.showAlert('Successfully Logged In', 'ok');
              //Assegno il valore recuperato dal body della response
              this.jwtToken = response.body.token;
              //Assegno il token  e il booleano al metodo 
              this.authentication.SetLoginJwtInfo(true, this.jwtToken);
              /*Decodifica la stringa del token e restituisce un oggetto JSON
              che rappresenta il payload del token */
              this.decodedTokenPayload = jwt_decode.jwtDecode(this.jwtToken);
              // Popola i dati nel servizio
              this.loggedUserService.setLoggedUser ({
                id: this.decodedTokenPayload.Id,
                firstName: this.decodedTokenPayload.FirstName,
                lastName: this.decodedTokenPayload.LastName,
                email: this.decodedTokenPayload.email,
                role: this.decodedTokenPayload.role
              });
              //Imposto la flag a false per far sparire il form di login
              this.isLoginOpen = false;
              // aggiunto router che rimanda direttamente alla home dopo un login effettuato//
                this.router.navigate(['/home'])
              break;
            case HttpStatusCode.NoContent:
              console.log('No Response');
              break;
          }
        },
        error: (err: any) => {
          switch (err.status) {
            case HttpStatusCode.Unauthorized:
              this.authentication.SetLoginJwtInfo(false,this.jwtToken);
              break;
          }
        },
      });
    } else {
      this.alertService.showAlert('Errore durante il login', 'error');
    }
  }

  //Iscrizione al servizio
  ngOnInit(): void {
    this.alertService.alertState$.subscribe(state => {
      this.showAlert = state.visible;
    });
  }
}

export class Credentials {
  Email: string = '';
  Password: string = '';
}
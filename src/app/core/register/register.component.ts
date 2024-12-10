import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from './service/user-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
// Creo un istanza di User
user : User = new User();
//Di dello userservice
constructor(private userService: UserService) {}

//Metodo eseguito al submit del form
async onSubmit(): Promise<void> {
  //Questo renderlo magari un validazione di un form che se è true esegue il metodo
  if(await this.verifyMail(this.user.EmailAddress)) {
    alert('Email già in uso');
    return;
  } else {
    console.log('User Data:', this.user); 
    this.userService.registerUser(this.user).subscribe(
    (response) => {
      console.log('Registrazione avvenuta con successo:', response);
      alert('Utente registrato con successo')
    },
    (error) => {
      alert('Email già in uso');
    }
    );
  }
}

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
    return true;
  }
}


}
export class User {
  FirstName : string;
  LastName : string;
  EmailAddress: string;
  Phone:string;
  Gender : string;
  CompanyName:string;
  Password: string;
  constructor() {
    this.FirstName = '';
    this.LastName = '';
    this.EmailAddress = '';
    this.Phone = '';
    this.Gender ='';
    this.CompanyName = '';
    this.Password = '';
  }
}

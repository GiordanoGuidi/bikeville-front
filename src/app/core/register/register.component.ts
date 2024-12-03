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
onSubmit(): void {
  //Questo renderlo magari un validazione di un form che se è true esegue il metodo
  console.log('User Data:', this.user); 
  this.userService.registerUser(this.user).subscribe(
    (response) => {
      console.log('Registrazione avvenuta con successo:', response);
      alert('Utente registrato con successo')
    },
    (error) => {
      alert('Email già in uso')
    }
  );
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

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from './service/registerUser-service';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
// Creo un istanza di User
user : NewUser = new NewUser();
//Di dello userservice
constructor(private userService: UserService, private router: Router) {}

@ViewChild('userForm') userForm!: NgForm;
//Metodo eseguito al submit del form
async onSubmit(): Promise<void> {
  //Questo renderlo magari un validazione di un form che se è true esegue il metodo
  if(await this.verifyMail(this.user.EmailAddress)) {
    alert('Email already in use');
    return;
  } else {
    console.log('User Data:', this.user); 
    this.userService.registerUser(this.user).subscribe(
    (response) => {
      console.log('Registration success:', response);
      alert('User registered successfully')
      this.user = {
        FirstName: '',
        LastName: '',
        EmailAddress: '',
        Phone: '',
        Gender: '',
        CompanyName: '',
        Password: ''
      };
      this.userForm.resetForm();
      this.router.navigate(['/home']);
    },
    (error) => {
      console.error('Registration Error:', error);
      alert('Unexpected Error');
    }
    );
  }
}

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
    console.error("Fetch Error:", error);
    // Se c'è un errore, restituisci un valore di default, ad esempio `false`
    return true;
  }
}


}
export class NewUser {
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

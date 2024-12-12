import { Component } from '@angular/core';
import { AuthService } from '../../shared/authentication/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
   constructor(private auth: AuthService, private router: Router) {
    this.auth.SetLoginJwtInfo(false, '');
    //? aggiunto router che rimanda in home//
    this.router.navigate(['/home']);
   }
  
     //TODO verificare se serve davvero questa funzione//
     RunLogout() {
       this.auth.SetLoginJwtInfo(false, '');
       //? aggiunto router che rimanda in home//
       this.router.navigate(['/home']);
     }
}

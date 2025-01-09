import { Component } from '@angular/core';
import { AuthService } from '../../shared/authentication/auth.service';
import { Router } from '@angular/router';
import { LoggedUserService } from '../login/service/loggedUser.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
   constructor(private auth: AuthService,
     private router: Router,
     private loggedUserService:LoggedUserService) {
    this.auth.SetLoginJwtInfo(false, '');
    //Setto lo user a null
    this.loggedUserService.setUser(null);
    // aggiunto router che rimanda in home//
    this.router.navigate(['/home']);
   }
  
     
     RunLogout() {
       this.auth.SetLoginJwtInfo(false, '');
       // aggiunto router che rimanda in home//
       this.router.navigate(['/home']);
     }
}

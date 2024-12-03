import { Component } from '@angular/core';
import { AuthService } from '../../shared/authentication/auth.service';


@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
   constructor(private auth: AuthService) {
    this.auth.SetLoginJwtInfo(false, '');
   }
  
     RunLogout() {
       this.auth.SetLoginJwtInfo(false, '');
     }
}

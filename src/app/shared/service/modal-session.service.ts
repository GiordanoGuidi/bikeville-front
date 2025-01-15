import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoggedUserService } from '../../core/login/service/loggedUser.service';
import { AuthService } from '../authentication/auth.service';
import { RouterModule } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class ModalSessionService {
  constructor(
    private loggedUserService:LoggedUserService,
    private auth:AuthService
  ){}
  private modalState = new BehaviorSubject<boolean>(false);

  modalState$ = this.modalState.asObservable();

  openModal() {
    this.modalState.next(true);
  }

  closeModal() {
    this.modalState.next(false);
    //eseguoi il logout
    this.loggedUserService.setLoggedUser(null);
    this.auth.SetLoginJwtInfo(false,'');
  }
}

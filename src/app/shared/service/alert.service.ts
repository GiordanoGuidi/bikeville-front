import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertState = new BehaviorSubject<{ message: string; status: string; visible: boolean }>({
    message: '',
    status: '',
    visible: false,
  });

  alertState$ = this.alertState.asObservable();

  showAlert(message: string, status: string) {
    this.alertState.next({ message, status, visible: true });
  }

  hideAlert() {
    this.alertState.next({ message: '', status: '', visible: false });
  }
  
}

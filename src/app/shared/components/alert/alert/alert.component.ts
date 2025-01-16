import { Component,Input,Output } from '@angular/core';
import { AlertService } from '../../../service/alert.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  @Input() message:string="";
  @Input() status:string='';
  // @Output() close = new EventEmitter<void>();
  constructor(private alertService:AlertService){}

  alert = { message: '', status: '', visible: false };

  // Iscrizione al servizio
  ngOnInit() {
    this.alertService.alertState$.subscribe(state => {
      this.alert = state;
    });
  }
  // Metodo per chiudere l'alert
  closeAlert() {
    this.alertService.hideAlert();
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActiveIndexService } from '../../shared/service/active-index.service';
import { AlertComponent } from '../../shared/components/alert/alert/alert.component';
import { AlertService } from '../../shared/service/alert.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,AlertComponent,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  //Flag per mostarre l'alert
  showAlert = false;
  constructor(
    private activeIndexService : ActiveIndexService,
    private alertService:AlertService
  ){
  }
   // Chiamo il metodo del servizio per aggiornare il valore
  setActiveIndexByName(value: string | null) {
    console.log('Nuovo indice attivo:', value); 
    this.activeIndexService.setActiveIndexByName(value);
  }

  //Iscrizione al servizio
  ngOnInit(): void {
    this.alertService.alertState$.subscribe(state => {
      this.showAlert = state.visible;
    });
  }
}


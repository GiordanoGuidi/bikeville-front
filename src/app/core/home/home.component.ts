import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActiveIndexService } from '../../shared/service/active-index.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(
    private activeIndexService : ActiveIndexService
  ){
  }
   // Chiamo il metodo del servizio per aggiornare il valore
  setActiveIndexByName(value: string | null) {
    console.log('Nuovo indice attivo:', value); 
    this.activeIndexService.setActiveIndexByName(value);
  }
}


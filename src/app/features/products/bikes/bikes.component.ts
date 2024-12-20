import { Component ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

import { BikeTypeFilter,BikeColorFilter } from '../../filters/bike/bike-filter-interfaces';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';


@Component({
  selector: 'app-bikes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bikes.component.html',
  styleUrl: './bikes.component.css'
})
export class BikesComponent {
  constructor(
    private http: HttpClient,
  ){
  }
  //array di tipi di biciclette
  bikeTypes:BikeTypeFilter[]=[];
  //array di colori delle biciclette
  bikeColors :BikeColorFilter[]=[];
  //Recupero i filtri dal backend
  getBikeFilters():void{
    this.http.get<BikeFiltersResponse>('https://localhost:7257/api/Products/bike-filters')
      .subscribe((response)=>{
       // Verifico e assegno i tipi di biciclette
      if (response.bikeTypes) {
        console.log(response.bikeTypes)
        this.bikeTypes.push(...response.bikeTypes);
      }
      // Verifica e assegna i colori delle biciclette
      if (response.bikeColors) {
        console.log(response.bikeColors)
        this.bikeColors.push(...response.bikeColors);
      }
    }, error => {
      console.error('Errore durante il recupero dei filtri', error);
    });
  }

   //Recupero le categorie all'inizializzazione del componente
   ngOnInit():void{
    this.getBikeFilters();
  }
  
}

//Interfaccia che contiene le chiavi degli array contenuti nell'oggetto passato dal backend
export interface BikeFiltersResponse {
   // bikeTypes è un array di BikeTypeFilter
  bikeTypes: BikeTypeFilter[];
   // bikeColors è un array di BikeColorFilter
  bikeColors:BikeColorFilter[];
}



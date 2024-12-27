import { Component ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../shared/Models/products';
import { BikeTypeFilter,BikeColorFilter,BikeSizeFilter } from '../../filters/bike/bike-filter-interfaces';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { ProductnologhttpService } from '../../../shared/httpservices/productnologhttp.service';

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
    private httRequest:ProductnologhttpService
  ){
  }
  //#Dates
  //array di biciclette 
  bikes :Product[]=[]
  //array di tipi di biciclette
  bikeTypes:BikeTypeFilter[]=[];
  //array di colori delle biciclette
  bikeColors :BikeColorFilter[]=[];
  //array di taglie delle biciclette
  bikeSizes :BikeSizeFilter[]=[];
  //Assegno l'id della parentcategory delle biciclette
  parentCategoryId = 1; 
  //Colore selezionato nei filtri
  selectedColor: string | null = null;
  //Tipologia selezionata nei filtri
  selectedType :number|null=null;
  //Taglia selezionata nei filtri
  selectedSize :string |null=null;
  //Array di oggetti per i filtri attivi attivi
  activeFilter: { filterType: string; value: any }[] = [];

  //#Function
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
      // Verifica e assegna i colori delle biciclette
      if (response.bikeSizes) {
        console.log(response.bikeSizes)
        this.bikeSizes.push(...response.bikeSizes);
      }
    }, error => {
      console.error('Errore durante il recupero dei filtri', error);
    });
  }

  //Recupero tutte le biciclette
  getBikes():void{
    this.httRequest.getProductsByParentCategory(this.parentCategoryId).subscribe({
      next:(data)=>{
        this.bikes = data;
        console.log(this.bikes)
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
  }

  //Funzione che aggiorna l'array di biciclette con le biciclette filtrate per colore
  onFilterChange(event:Event,filterType:'color'|'typeId'|'size'):void{
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

     // Se la checkbox è selezionata
    if (inputElement.checked) {
      // Rimuovo eventuali oggetti dello stesso tipo di filtro
      this.activeFilter = this.activeFilter.filter(filter => filter.filterType !== filterType);
      // Converto il valore nel tipo corretto
      let coercedValue = filterType === 'typeId' ? Number(value) : value;
      // Aggiungo il nuovo filtro
      this.activeFilter.push({ filterType, value:coercedValue });
      
      // Aggiorno i valori selezionati
      if (filterType === 'color') this.selectedColor = value;
      if (filterType === 'typeId') this.selectedType = Number(value);
      console.log(this.selectedType)
      if (filterType === 'size') this.selectedSize = value;
    } 
    else {
      // Converto il valore nel tipo corretto prima di confrontarlo
      const coercedValue = filterType === 'typeId' ? Number(value) : value;
      // Se la checkbox viene deselezionata, rimuovo quel filtro specifico
      this.activeFilter = this.activeFilter.filter(
        filter => !(filter.filterType === filterType && filter.value === coercedValue)
      );
      // Resetta i valori selezionati
      if (filterType === 'color') this.selectedColor = null;
      console.log('colore selezionato',this.selectedColor)
      if (filterType === 'typeId') this.selectedType = null;
          console.log('tipo selezionato',this.selectedType)
      if (filterType === 'size') this.selectedSize = null;
          console.log('taglia selezionato',this.selectedSize)
    }
    console.log(this.activeFilter)
    // Richiesta HTTP per filtrare le biciclette
    this.httRequest.getFilteredProducts(this.parentCategoryId,this.selectedColor,this.selectedType,this.selectedSize).subscribe({
      next:(data)=>{
        console.log(data);
        this.bikes = data;
        console.log(this.bikes)
        console.log('filtri attivi:',this.activeFilter)
      },
      error: (err) => {
        console.error('Error:', err);
      },
    })
  }

  // Metodo per verificare se un filtro è attivo
  isFilterActive(filterType: string, value: string|number): boolean {
    const coercedValue = filterType === 'typeId' ? Number(value) : value;
    return this.activeFilter.some(filter => filter.filterType === filterType && filter.value === coercedValue);
  }

  //Metodo per rimuovere un filtro attivo
  removeFilter(filterType:string){
    //Resetto i valore in base al tipo di filtro 
    switch(filterType){
      case'color':this.selectedColor = null;
      break;
      case'typeId':this.selectedType = null;
      break;
      case'size':this.selectedSize = null;
      break;
      default:
        console.log('Filtro non valido');
    }
    // Richiesta HTTP per filtrare le biciclette
    this.httRequest.getFilteredProducts(this.parentCategoryId,this.selectedColor,this.selectedType,this.selectedSize).subscribe({
      next:(data)=>{
        console.log(data);
        this.bikes = data;
        console.log(this.bikes)
        console.log('filtri attivi:',this.activeFilter)
      },
      error: (err) => {
        console.error('Error:', err);
      },
    })
    //Rimuovo il filtro dall array di filtri attivi
    this.activeFilter = this.activeFilter.filter(filter => filter.filterType !== filterType);
    console.log(this.activeFilter)
  }

  //Metodo che restituisce la stringa di tipologia di bicicletta dal suo id
  getActiveFilter(value: number|string): string|number {
    if(value==5||value==6||value==7){
      const typeMap: { [key: number]: string } = {
        5: 'Mountain Bikes',
        6: 'Road Bikes',
        7: 'Touring Bikes'
      };
      return typeMap[value] || 'Unknown Type';
    }else{
      return value
    }
  }

   //Recupero i filtri e le biciclette all'inizializzazione del componente
   ngOnInit():void{
    this.getBikeFilters();
    this.getBikes();
  }
  
}

//Interfaccia che contiene le chiavi degli array contenuti nell'oggetto passato dal backend
export interface BikeFiltersResponse {
   // bikeTypes è un array di BikeTypeFilter
  bikeTypes: BikeTypeFilter[];
   // bikeColors è un array di BikeColorFilter
  bikeColors:BikeColorFilter[];
  bikeSizes:BikeSizeFilter[];
}



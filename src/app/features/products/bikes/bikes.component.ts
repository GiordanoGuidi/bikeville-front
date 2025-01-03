import { Component ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../shared/Models/products';
import { TypeFilter,ColorFilter,SizeFilter, PriceFilter } from '../../filters/bike/bike-filter-interfaces';
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
    private httpRequest:ProductnologhttpService
  ){
  }
  //#Dates
  //array di biciclette 
  bikes :Product[]=[]
  //array di tipi di biciclette
  bikeTypes:TypeFilter[]=[];
  //array di colori delle biciclette
  bikeColors :ColorFilter[]=[];
  //array di taglie delle biciclette
  bikeSizes :SizeFilter[]=[];
  //Arry fasce di prezzo biciclette
  bikePrices :PriceFilter[]=[];
  //Assegno l'id della parentcategory delle biciclette
  parentCategoryId = 1; 
  //Colore selezionato nei filtri
  selectedColor: string | null = null;
  //Tipologia selezionata nei filtri
  selectedType :number|null=null;
  //Taglia selezionata nei filtri
  selectedSize :string |null=null;
  //Prezzo selezionato nei filtri
  selectedPrice :number|null=null;
  //Array di oggetti per i filtri attivi attivi
  activeFilter: { filterType: string; value: any }[] = [];

  //#Function
  //Recupero i filtri dal backend
  getBikeFilters():void{
    this.httpRequest.getProductFilters(this.parentCategoryId)
      .subscribe((response)=>{
        console.log(response)
       // Verifico e assegno i tipi di biciclette
      if (response.types) {
        this.bikeTypes.push(...response.types);
        console.log(this.bikeTypes)
      }
      // Verifica e assegna i colori delle biciclette
      if (response.colors) {
        this.bikeColors.push(...response.colors);
        console.log(this.bikeColors)
      }
      // Verifica e assegna i colori delle biciclette
      if (response.sizes) {
        this.bikeSizes.push(...response.sizes);
        console.log(this.bikeSizes)
      }
      if(response.prices){
        this.bikePrices.push(...response.prices);
        console.log(this.bikePrices)
      }
    }, error => {
      console.error('Errore durante il recupero dei filtri', error);
    });
  }

  //Recupero tutte le biciclette
  getBikes():void{
    this.httpRequest.getProductsByParentCategory(this.parentCategoryId).subscribe({
      next:(data)=>{
        this.bikes = data;
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
  }

  //Funzione che aggiorna l'array di biciclette con le biciclette filtrate per colore
  onFilterChange(event:Event,filterType:'color'|'typeId'|'size'|'price'):void{
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

     // Se la checkbox è selezionata
    if (inputElement.checked) {
      // Rimuovo eventuali oggetti dello stesso tipo di filtro
      this.activeFilter = this.activeFilter.filter(filter => filter.filterType !== filterType);
      // Converto il valore nel tipo corretto
      let coercedValue = filterType === 'typeId' || filterType === 'price' ? Number(value) : value;
      // Aggiungo il nuovo filtro
      this.activeFilter.push({ filterType, value:coercedValue });
      
      // Aggiorno i valori selezionati
      if (filterType === 'color') this.selectedColor = value;
      if (filterType === 'typeId') this.selectedType = Number(value);
      if (filterType === 'size') this.selectedSize = value;
      if (filterType === 'price') this.selectedPrice = Number(value);
    } 
    else {
      // Converto il valore nel tipo corretto prima di confrontarlo
      const coercedValue = filterType === 'typeId' || filterType === 'price' ? Number(value) : value;
      // Se la checkbox viene deselezionata, rimuovo quel filtro specifico
      this.activeFilter = this.activeFilter.filter(
        filter => !(filter.filterType === filterType && filter.value === coercedValue)
      );
      // Resetta i valori selezionati
      if (filterType === 'color') this.selectedColor = null;
      if (filterType === 'typeId') this.selectedType = null;
      if (filterType === 'size') this.selectedSize = null;
      if (filterType === 'price') this.selectedPrice = null;
    }
    // Richiesta HTTP per filtrare le biciclette
    this.httpRequest.getFilteredProducts(this.parentCategoryId,this.selectedColor,this.selectedType,this.selectedSize,this.selectedPrice).subscribe({
      next:(data)=>{
        this.bikes = data;
        console.log(this.bikes)
      },
      error: (err) => {
        console.error('Error:', err);
      },
    })
  }

  // Metodo per verificare se un filtro è attivo
  isFilterActive(filterType: string, value: string|number): boolean {
    const coercedValue = filterType === 'typeId' || filterType === 'price' ? Number(value) : value;
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
      case 'price':this.selectedPrice = null;
      break;
      default:
        console.log('Filtro non valido');
    }
    // Richiesta HTTP per filtrare le biciclette
    this.httpRequest.getFilteredProducts(this.parentCategoryId,this.selectedColor,this.selectedType,this.selectedSize,this.selectedPrice).subscribe({
      next:(data)=>{
        this.bikes = data;
        console.log('filtri attivi:',this.activeFilter)
      },
      error: (err) => {
        console.error('Error:', err);
      },
    })
    //Rimuovo il filtro dall array di filtri attivi
    this.activeFilter = this.activeFilter.filter(filter => filter.filterType !== filterType);
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
    }
    else if( value==1||value==2||value==3||value==4){
      const typeMap: { [key: number]: string } = {
        1: 'Up to 700€',
        2: '700-1500€',
        3: '1500-2500€',
        4: '2500€ and more',
      };
      return typeMap[value] || 'Unknown Type';
    }
    else{
      return value
    }
  }
  toLower(string:string){
    return string.toLowerCase();
  }

   //Recupero i filtri e le biciclette all'inizializzazione del componente
   ngOnInit():void{
    this.getBikeFilters();
    this.getBikes();
  }
  
}

//Interfaccia che contiene le chiavi degli array contenuti nell'oggetto passato dal backend
export interface BikeFiltersResponse {
   // bikeTypes è un array di TypeFilter
  bikeTypes: TypeFilter[];
   // bikeColors è un array di ColorFilter
  bikeColors:ColorFilter[];
   // bikeColors è un array di SizeFilter
  bikeSizes:SizeFilter[];
   // bikeColors è un array di PriceFilter
  bikePrices:PriceFilter[];
}



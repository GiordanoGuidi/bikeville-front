import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../shared/Models/products';
import { TypeFilter,ColorFilter,SizeFilter, PriceFilter } from '../../filters/bike-filter-interfaces';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { ProductnologhttpService } from '../../../shared/httpservices/productnologhttp.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
@Component({
  selector: 'app-components',
  standalone: true,
  imports: [CommonModule,SidebarComponent],
  templateUrl: './bike-components.component.html',
  styleUrl: './bike-components.component.css'
})
export class BikeComponentsComponent {
  constructor(
    private http:HttpClient,
    private httpRequest:ProductnologhttpService
  ){}
  //#Dates
  //Assegno l'id della parentcategory delle biciclette
  parentCategoryId = 2; 
  //array dei componenti
  components :Product[]=[]
  //array di tipi di componenti
  componentTypes:TypeFilter[]=[];
  //array di colori dei componenti
  componentColors :ColorFilter[]=[];
  //array di taglie dei componenti
  componentSizes :SizeFilter[]=[];
  //array fasce di prezzo dei componenti
  componentPrices :PriceFilter[]=[];
  //Array di oggetti per i filtri attivi attivi
  activeFilter: { filterType: string; value: any }[] = [];
  //Colore selezionato nei filtri
  selectedColor: string | null = null;
  //Tipologia selezionata nei filtri
  selectedType :number|null=null;
  //Taglia selezionata nei filtri
  selectedSize :string |null=null;
  //Prezzo selezionato nei filtri
  selectedPrice :number|null=null;


  //#Function
  //Recupero tutti i componenti delle biciclette
  getBikeComponents():void{
    this.httpRequest.getProductsByParentCategory(this.parentCategoryId).subscribe({
      next:(data)=>{
        this.components=data;
        console.log(this.components)
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
  }

  //Recupero i filtri dei componenti delle biciclette
  getBikeComponentsFilters():void{
    this.httpRequest.getProductFilters(this.parentCategoryId)
      .subscribe((response)=>{
        console.log(response)
         // Verifico e assegno i tipi di biciclette
      if (response.types) {
        this.componentTypes.push(...response.types);
        console.log(this.componentTypes)
      }
      // Verifica e assegna i colori delle biciclette
      if (response.colors) {
        this.componentColors.push(...response.colors);
        console.log(this.componentColors)
      }
      // Verifica e assegna i colori delle biciclette
      if (response.sizes) {
        this.componentSizes.push(...response.sizes);
        console.log(this.componentSizes)
      }
      if(response.prices){
        this.componentPrices.push(...response.prices);
        console.log(this.componentPrices)
      }
      }, error => {
        console.error('Errore durante il recupero dei filtri', error);
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
      console.log(this.activeFilter)
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
        this.components = data;
        console.log(this.components)
      },
      error: (err) => {
        console.error('Error:', err);
      },
    })
  }

  //! Rimuovere alla fine?
   // Metodo per verificare se un filtro è attivo
   isFilterActive(filterType: string, value: string|number): boolean {
    const coercedValue = filterType === 'typeId' || filterType === 'price' ? Number(value) : value;
    return this.activeFilter.some(filter => filter.filterType === filterType && filter.value === coercedValue);
  }

  //! Rimuovere alla fine?
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
        this.components = data;
        console.log('filtri attivi:',this.activeFilter)
      },
      error: (err) => {
        console.error('Error:', err);
      },
    })
    //Rimuovo il filtro dall array di filtri attivi
    this.activeFilter = this.activeFilter.filter(filter => filter.filterType !== filterType);
  }

  //! Rimuovere alla fine?
  //Metodo che restituisce la stringa di tipologia di bicicletta dal suo id
  getActiveFilter(value: number): string | number {
    const typeMap1: { [key: number]: string } = {
      1: 'Up to 100€',
      2: '100-500€',
      3: '500-100€',
      4: '1000€ and more',
    };
  
    const typeMap2: { [key: number]: string } = {
      8: 'Handlebars',
      9: 'Bottom Brackets',
      10: 'Brakes',
      11: 'Chains',
      12: 'Cranksets',
      13: 'Derailleurs',
      14: 'Forks',
      15: 'Headsets',
      16: 'Mountain Frames',
      17: 'Pedals',
      18: 'Road Frames',
      19: 'Saddles',
      20: 'Touring Frames',
      21: 'Wheels',
    };
  
    switch (true) {
      case value >= 1 && value <= 4:
        return typeMap1[value as number] || 'Unknown Type';
      case value >= 8 && value <= 21:
        return typeMap2[value as number] || 'Unknown Type';
      default:
        return value;
    }
  }

  //! Rimuovere alla fine?
  //Metodo per restituire una stringa in minuscolo
  toLower(input: string): string {
    return input.replace(/\//g, '-').toLowerCase();
  }

  ngOnInit():void{
    this.getBikeComponents();
    this.getBikeComponentsFilters();
  }
}

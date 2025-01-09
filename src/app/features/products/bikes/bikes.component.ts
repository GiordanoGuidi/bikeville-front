import { Component ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../shared/Models/products';
import { TypeFilter,ColorFilter,SizeFilter, PriceFilter } from '../../filters/filters-interfaces';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { ProductnologhttpService } from '../../../shared/httpservices/productnologhttp.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { MobileFilterComponent } from '../../../shared/components/mobile-filter/mobile-filter/mobile-filter.component';
import { CardComponent } from '../../../shared/components/product-card/card/card.component';
import { PaginationComponent } from '../../../shared/components/products-pagination/pagination/pagination.component';
import { PaginationService } from '../../../shared/service/pagination-service';
@Component({
  selector: 'app-bikes',
  standalone: true,
  imports: [CommonModule,
            SidebarComponent,
            MobileFilterComponent,
            CardComponent,
            PaginationComponent],
  templateUrl: './bikes.component.html',
  styleUrl: './bikes.component.css'
})
export class BikesComponent {
  constructor(
    private http: HttpClient,
    private httpRequest:ProductnologhttpService,
    private paginationService: PaginationService
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
  //Array di oggetti per i filtri attivi
  activeFilter: { filterType: string; value: any }[] = [];
  //Prodotti paginati
  paginatedProducts:Product[]=[];
  

 
  //#Function
  //Recupero i filtri dal backend
  getBikeFilters():void{
    this.httpRequest.getProductFilters(this.parentCategoryId)
      .subscribe((response)=>{
       // Verifico e assegno i tipi di biciclette
      if (response.types) {
        this.bikeTypes.push(...response.types);
      }
      // Verifica e assegna i colori delle biciclette
      if (response.colors) {
        this.bikeColors.push(...response.colors);
      }
      // Verifica e assegna i colori delle biciclette
      if (response.sizes) {
        this.bikeSizes.push(...response.sizes);
      }
      if(response.prices){
        this.bikePrices.push(...response.prices);
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
  onFilterChange(event:Event,filterType:'typeId'|'color'|'size'|'price'):void{
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

     // Se la checkbox è selezionata
    if (inputElement.checked) {
      // Rimuovo eventuali oggetti dello stesso tipo di filtro
      this.activeFilter = this.activeFilter.filter(filter => filter.filterType !== filterType);
      // Converto il valore nel tipo corretto
      let coercedValue = filterType === 'typeId' || filterType === 'price' ? Number(value) : value;
      // Aggiungo il nuovo filtro attivo
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
        // Imposto la pagina corrente a 1 dopo il filtraggio
        this.paginationService.setCurrentPage(1);
      },
      error: (err) => {
        console.error('Error:', err);
      },
    })
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
      },
      error: (err) => {
        console.error('Error:', err);
      },
    })
    //Rimuovo il filtro dall array di filtri attivi
    this.activeFilter = this.activeFilter.filter(filter => filter.filterType !== filterType);
  }

  //Metodo per ricevere i prodotti paginati e assegnarli alla variabile
  onChildNotify(eventData:Product[]):void{
    this.paginatedProducts=eventData;
  }


   //Recupero i filtri e le biciclette all'inizializzazione del componente
   ngOnInit():void{
    this.getBikeFilters();
    this.getBikes();
  }

 
  
}


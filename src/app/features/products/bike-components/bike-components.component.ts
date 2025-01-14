import { Component,OnInit } from '@angular/core';
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
import { AuthService } from '../../../shared/authentication/auth.service';
import { Router, NavigationStart } from '@angular/router';
import * as bootstrap from 'bootstrap';

declare const $: any;

@Component({
  selector: 'app-components',
  standalone: true,
  imports: [CommonModule,
            SidebarComponent,
            MobileFilterComponent,
            CardComponent,
            PaginationComponent],
  templateUrl: './bike-components.component.html',
  styleUrl: './bike-components.component.css'
})
export class BikeComponentsComponent {
  constructor(
    public auth : AuthService,
    private router: Router,
    private http:HttpClient,
    private httpRequest:ProductnologhttpService,
    private paginationService: PaginationService
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
  //Prodotti paginati
  paginatedProducts:Product[]=[];

  //#Function
  //Recupero tutti i componenti delle biciclette
  getBikeComponents():void{
    this.httpRequest.getProductsByParentCategory(this.parentCategoryId).subscribe({
      next:(data)=>{
        this.components=data;
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
         // Verifico e assegno i tipi di biciclette
      if (response.types) {
        this.componentTypes.push(...response.types);
      }
      // Verifica e assegna i colori delle biciclette
      if (response.colors) {
        this.componentColors.push(...response.colors);
      }
      // Verifica e assegna i colori delle biciclette
      if (response.sizes) {
        this.componentSizes.push(...response.sizes);
      }
      if(response.prices){
        this.componentPrices.push(...response.prices);
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
        this.components = data;
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

  ngOnInit():void{
    this.getBikeComponents();
    this.getBikeComponentsFilters();
    this.router.events.subscribe(event => {
          if (event instanceof NavigationStart) {
            // Remove modal backdrop on navigation
            $(".modal-backdrop").remove();
          }
        });
  }

  async  viewProduct(prodotto: Product) {
    
    const categoryResponse = await fetch("https://localhost:7257/api/Products/categoryId/" + prodotto.productCategoryId);
    const modelResponse = await fetch("https://localhost:7257/api/Products/modelId/" + prodotto.productModelId);
    const descriptionResponse = await fetch("https://localhost:7257/api/Products/getDescByModelId/" + prodotto.productModelId);
    const category = await categoryResponse.text();
    const model = await modelResponse.text();
    const description = await descriptionResponse.json();

    const Paragraph = document.getElementById("productData") as HTMLParagraphElement;
    Paragraph.innerHTML = `
    <div>
    <div class = "d-flex">
    <div>
    <img src = "data:image/gif;base64,${prodotto.thumbNailPhoto}" style = "min-width: 500px; height: auto;" alt="Immagine">
    </div>
    <div class = "d-flex flex-column justify-content-start ps-5">
    <h1> ${prodotto.name} </h1>
    <hr>
    <h2>${prodotto.listPrice.toFixed(2)}€ </h2>
    <p style = "font-size: 20px;"> <br>
     <strong>Color:</strong> ${prodotto.color || 'N/A'} <br>
     <strong>Size:</strong> ${prodotto.size || '0'} <br>
     <strong>Weight:</strong> ${prodotto.weight || '0'} kg <br>
     <strong>Category:</strong> ${category} <br>
     <strong>Model:</strong> ${model} <br>
     <strong>Number:</strong> ${prodotto.productNumber} 
    </p>
    </div>
    </div>
    </div>
    <hr>
    <p style = "font-size: 20px;"> ${description[0].description} </p>
    `;

    const modalElement = document.getElementById('viewProduct');
                if (modalElement) {
                  const modal = new bootstrap.Modal(modalElement);
                  modal.show();
                } else {
                  console.error('Modal element not found!');
                }
              }
}

import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../shared/Models/products';
import { TypeFilter,ColorFilter,SizeFilter, PriceFilter } from '../../filters/bike/bike-filter-interfaces';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { ProductnologhttpService } from '../../../shared/httpservices/productnologhttp.service';

@Component({
  selector: 'app-components',
  standalone: true,
  imports: [CommonModule],
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



  ngOnInit():void{
    this.getBikeComponents();
    this.getBikeComponentsFilters();
  }
}

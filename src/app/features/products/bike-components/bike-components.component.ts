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



  ngOnInit():void{
    this.getBikeComponents();
    this.getBikeComponentsFilters();
  }
}

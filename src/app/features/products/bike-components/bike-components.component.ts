import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../shared/Models/products';
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
      }, error => {
        console.error('Errore durante il recupero dei filtri', error);
      });
  }



  ngOnInit():void{
    this.getBikeComponents();
    this.getBikeComponentsFilters();
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { Observable } from 'rxjs';
import { Product } from '../Models/products';

@Injectable({
  providedIn: 'root'
})
export class ProductnologhttpService {
 
  constructor(private http: HttpClient, private auth: AuthService) { }

  //Funzione per recuperare tutti i prodotti
  getProductnolog(): Observable<any>{
    return this.http.get('https://localhost:7257/api/Products', 
      {headers: this.auth.authenticationJwtHeader}
    );
  }

  //Funzione per recuperare i prodotti in base alla categoria
  getProductsByParentCategory(parentCategoryId: number): Observable<Product[]> {
    const params = new HttpParams().set('id', parentCategoryId.toString());
    return this.http.get<Product[]>('https://localhost:7257/api/Products/by-parent-category', { params });
  }

  //Funzione per recuperare le biciclette filtrate
  getFilteredProducts(parentCategoryId:number,color?:string|null,typeId?:number|null,size?:string|null,price? :number|null):Observable<Product[]>{
    let params = new HttpParams().set('parentCategoryId', parentCategoryId.toString());
    if (color) {
      params = params.set('color', color);
    }
    if (typeId) {
      params = params.set('typeId', typeId);
    }
    if (size) {
      params = params.set('size', size);
    }
    if (price) {
      params = params.set('price', price);
    }

    return this.http.get<Product[]>('https://localhost:7257/api/Products/get-filtered-bikes', { params });
  }
}







  


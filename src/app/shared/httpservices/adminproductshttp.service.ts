import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../authentication/auth.service';
import { Observable } from 'rxjs';
import { Product } from '../Models/products';
import { ProductDTO } from '../Models/productsDTO';
import { UpdatedProduct } from '../Models/UpdateProduct';

@Injectable({
  providedIn: 'root'
})
export class AdminproductshttpService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  getAdminProducts(): Observable<any>{
    return this.http.get('https://localhost:7257/api/Products', 
      {headers: this.auth.authenticationJwtHeader}
    );
  }

  getAdminProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`https://localhost:7257/api/Products/${id}`);
  }

  updateAdminProduct(id: number, product: UpdatedProduct): Observable<Product> {
    return this.http.put<Product>(`https://localhost:7257/api/Products/${id}`, product);
  }
  

  postAdminProduct(product: ProductDTO): Observable<ProductDTO>{
    return this.http.post<ProductDTO>('https://localhost:7257/api/Products', product);
  }
}

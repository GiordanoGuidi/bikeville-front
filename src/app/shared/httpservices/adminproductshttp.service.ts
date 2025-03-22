import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../authentication/auth.service';
import { Observable } from 'rxjs';
import { Product } from '../Models/products';
import { ProductDTO } from '../Models/productsDTO';
import { UpdatedProduct } from '../Models/UpdateProduct';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminproductshttpService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  getAdminProducts(): Observable<any>{
    //!forse qui non c'è la validazione del token nel backend solo nel frontend?
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
    // Recupero il token JWT dal localStorage
    const jwtToken = localStorage.getItem('jwtToken');
    // Imposto gli headers con il token
    const headers = new HttpHeaders({
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json', 
    });
    return this.http.post<ProductDTO>('https://localhost:7257/api/Products',
     product,
    {headers});
  }

  deleteAdminProduct(id: number): Observable<void>{
    return this.http.delete<void>(`https://localhost:7257/api/Products/${id}`);
  }
}

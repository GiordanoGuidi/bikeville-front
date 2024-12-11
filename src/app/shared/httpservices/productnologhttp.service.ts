import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductnologhttpService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  getProductnolog(): Observable<any>{
    return this.http.get('https://localhost:7257/api/Products', 
      {headers: this.auth.authenticationJwtHeader}
    );
  }
}

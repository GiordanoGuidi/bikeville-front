import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../authentication/auth.service';
import { Observable } from 'rxjs';
import { Customer } from '../Models/customer';

@Injectable({
  providedIn: 'root'
})
export class AdmincustomershttpService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  getAdminCustomers(): Observable<any>{
    return this.http.get('https://localhost:7257/api/Customers', 
      {headers: this.auth.authenticationJwtHeader}
    );
  }

  getMail(id: number): Observable<any>{
    return this.http.get(`https://localhost:7257/getMail/${id}`, {responseType: 'text'});
  }
}

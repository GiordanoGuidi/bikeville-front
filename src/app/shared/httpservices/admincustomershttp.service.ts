import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../authentication/auth.service';
import { Observable } from 'rxjs';
import { Customer } from '../Models/customer';
import { UpdateCustomer } from '../Models/UpdateCustomer';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AdmincustomershttpService {

  constructor(private http: HttpClient, private auth: AuthService) { }


  getAdminCustomers(options?: { headers?: HttpHeaders }): Observable<any> {
    return this.http.get('https://localhost:7257/api/Customers',
      { headers: this.auth.authenticationJwtHeader, ...options }
    );
  }

  //Metodo per recuperare le email degli utenti 
  getMail(id: number, options?: { headers?: HttpHeaders }): Observable<any> {
    return this.http.get(`https://localhost:7257/getMail/${id}`, { responseType: 'text', ...options });
  }

  updateAdminCustomers(id: number, customer: UpdateCustomer): Observable<Customer> {
    return this.http.put<Customer>(`https://localhost:7257/api/Customers/${id}`, customer);
  }

  deleteAdminCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`https://localhost:7257/api/Customers/${id}`);
  }
}

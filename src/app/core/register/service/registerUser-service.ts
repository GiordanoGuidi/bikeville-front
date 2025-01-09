import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewUser } from '../register.component';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  registerUser(user: NewUser): Observable<any> {
    return this.http.post<any>('https://localhost:7257/api/Customers', user);
  }
}

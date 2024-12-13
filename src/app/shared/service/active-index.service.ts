import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActiveIndexService {
  //! Commenta
  //Creo oggetto BehaviorSubject di tipo number inizializzato a null
  private activeIndexSubject = new BehaviorSubject<number | null>(null);
  
  activeIndex$ = this.activeIndexSubject.asObservable();

  constructor(private router: Router) {
    // Resetta activeIndex su ogni navigazione
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setActiveIndex(null);
      });
  }

  setActiveIndex(value: number | null) {
    this.activeIndexSubject.next(value);
  }

}

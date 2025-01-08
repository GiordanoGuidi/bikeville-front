import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor(private router: Router) {
    //stream di eventi emessi dal router quando cambia stato
    this.router.events
    //filtro gli eventi navigationend
      .pipe(filter(event => event instanceof NavigationEnd))
      //se l'evento di tipo navigationend esiste eseguo il codice
      .subscribe((event:NavigationEnd) => {
        this.setCurrentPage(1);
      });
  }
  
  //istanza BehaviorSubject con valore iniziale 1
  private currentPageSubject = new BehaviorSubject<number>(1);
  //Converto il BehaviorSubject in un Observable
  currentPage$ = this.currentPageSubject.asObservable();
  //metodo per aggiornare il valore 
  setCurrentPage(page: number): void {
      this.currentPageSubject.next(page);
  }
}

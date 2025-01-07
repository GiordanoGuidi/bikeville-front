import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  //istanza BehaviorSubject con valore iniziale 1
  private currentPageSubject = new BehaviorSubject<number>(1);
  //Converto il BehaviorSubject in un Observable
  currentPage$ = this.currentPageSubject.asObservable();
  //metodo per aggiornare il valore 
  setCurrentPage(page: number): void {
      this.currentPageSubject.next(page);
  }
}

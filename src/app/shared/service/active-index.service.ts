import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActiveIndexService {
  //Istanza variabile index
  index:number |null=null;
  
  //Creo oggetto BehaviorSubject di tipo number inizializzato a null
  private activeIndexSubject = new BehaviorSubject<number | null>(null);
  
  // Espongo un Observable per permettere ai componenti di iscriversi allo stato
  activeIndex$ = this.activeIndexSubject.asObservable();

  constructor(private router: Router) {
    //stream di eventi emessi dal router quando cambia stato
    this.router.events
    //filtro gli eventi navigationend
      .pipe(filter(event => event instanceof NavigationEnd))
      //se l'evento di tipo navigationend esiste eseguo il codice
      .subscribe((event:NavigationEnd) => {
        //Array di rotte
        const routes= ['/Bikes','/Components','/Clothing','/Accessories'];
        //Se le rotte dei filtri non sono incluse nell'url resetto activeIndex a null
        if(!routes.includes(event.url)){
          this.setActiveIndex(null);
        }
      });
  }

  //Aggiorno lo stato di activeIndexSubject con il valore di value
  setActiveIndex(value: number | null) {
    this.activeIndexSubject.next(value);
  }

  //Aggiorno lo stato di activeIndexSubject passando una stringa
  setActiveIndexByName(value: string| null){
    switch(value){
      case'Bikes':
      this.index = 0;
      break;
      case'Components':
      this.index = 1;
      break;
      case'Clothing':
      this.index = 2;
      break;
      case'Accessories':
      this.index = 3;
      break;
    }
    this.activeIndexSubject.next(this.index);
  }

}

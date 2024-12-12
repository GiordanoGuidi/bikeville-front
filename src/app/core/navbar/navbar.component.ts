import { Component,OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../shared/authentication/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor (public auth : AuthService,private http: HttpClient){}
  //Array delle categorie
  categoriesArray : ParentCategories[]=[];

  activeIndex:number=0;

  //Funzione per recuperare le categorie
  getParentCategories(): void {
    this.http.get<any[]>('https://localhost:7257/api/Products/parent-categories')
      .subscribe((categories) => {
        categories.forEach(category => {
          // Crea un'istanza della classe ParentCategories con i dati ricevuti
        const parentCategory = new ParentCategories(category.productCategoryId, category.name);
        // Aggiungi l'istanza all'array delle categorie
        this.categoriesArray.push(parentCategory);
        });
        console.log(this.categoriesArray); // Verifica l'array popolato
      });
  }

  //Recupero le categorie all'inizializzazione del componente
  ngOnInit():void{
    this.getParentCategories();
  }

  //Imposto l'id attivo corrispondente alla categoria
  setActiveIndex(index:number){
    this.activeIndex = index;
  }

  //Funzione per controllare che l'activeIndex sia uguale all'indice della categoria
  isActive(index: number): boolean {
    return this.activeIndex === index; 
  }
}

export class ParentCategories{
  Id :number = 0;
  Name :string = '';
  constructor(id:number=0,name:string=''){
    this.Id = id;
    this.Name = name;
  }
}



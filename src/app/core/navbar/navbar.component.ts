import { Component,OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../shared/authentication/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActiveIndexService } from '../../shared/service/active-index.service';
import { Router, NavigationEnd } from '@angular/router';
import { LoggedUserService } from '../login/service/loggedUser.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  //Costruttore
  constructor (
    public auth : AuthService,
    private http: HttpClient,
    private activeIndexService:ActiveIndexService,
    private router:Router,
    private loggedUserService:LoggedUserService,
  ){
    //Abbonamento a activeIndexService
    this.activeIndexService.activeIndex$.subscribe(index => {
      console.log('Navbar index updated:', index);
      this.activeIndex = index;
    });
    // Gestione dei cambiamenti di rotta
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Se l'url non è /login,/register showFilters sarà vera
        this.showFilters = !['/login', '/register','/adminproducts','/adminhub','/admincustomers'].includes(event.url);
      }
    });
  }
  //Array delle categorie
  categoriesArray : ParentCategories[]=[];
  //Istanza variabile activeIndex
  activeIndex:number| null = null;
  //Istanza flag showFilters
  showFilters : boolean = true
  
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
  setActiveIndex(index: number) {
    this.activeIndexService.setActiveIndex(index);
  }

  //Funzione per controllare che l'activeIndex sia uguale all'indice della categoria
  isActive(index: number): boolean {
    return this.activeIndex === index; 
  }

  // Metodo per controllare se il ruolo è Admin
  isAdmin(): boolean {
    const loggedUser = localStorage.getItem('loggedUser');
    const loggedUserObject=loggedUser? JSON.parse(loggedUser):null;
    return loggedUserObject?.role === 'Admin';
  }

  // Metodo per eseguire il logout
  RunLogout() {
    //Rimuovo i dati dell'utente loggato
    this.loggedUserService.setLoggedUser(null);
    //Rimuovo i dati dal localstorage
     this.auth.SetLoginJwtInfo(false, '');
     // aggiunto router che rimanda in home//
     this.router.navigate(['/home']);
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



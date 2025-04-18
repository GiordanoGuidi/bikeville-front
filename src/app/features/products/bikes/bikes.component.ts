import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../shared/Models/products';
import { TypeFilter, ColorFilter, SizeFilter, PriceFilter } from '../../filters/filters-interfaces';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ProductnologhttpService } from '../../../shared/httpservices/productnologhttp.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { MobileFilterComponent } from '../../../shared/components/mobile-filter/mobile-filter/mobile-filter.component';
import { CardComponent } from '../../../shared/components/product-card/card/card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { PaginationService } from '../../../shared/service/pagination-service';
import { AuthService } from '../../../shared/authentication/auth.service';
import { Router, NavigationStart } from '@angular/router';
import * as bootstrap from 'bootstrap';
// import { CartService } from '../../../shared/service/cart.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { SkeletonContainerComponent } from '../../../shared/components/skeleton-container/skeleton-container.component';
import { SessionModalComponent } from '../../../shared/components/session-modal/session-modal/session-modal.component';
import { ProductModalComponent } from '../../../shared/components/product-modal/product-modal.component';
declare const $: any;
@Component({
  selector: 'app-bikes',
  standalone: true,
  imports: [CommonModule,
    SidebarComponent,
    MobileFilterComponent,
    CardComponent,
    PaginationComponent,
    SkeletonContainerComponent,
    SessionModalComponent,
    ProductModalComponent,
    ],
  templateUrl: './bikes.component.html',
  styleUrl: './bikes.component.css'
})
export class BikesComponent {
  constructor(
    public auth: AuthService,
    // public cart: CartService,
    private router: Router,
    private http: HttpClient,
    private httpRequest: ProductnologhttpService,
    private paginationService: PaginationService,
    public loaderService: LoaderService,
  ) {
    this.loaderService.loading$.subscribe(state => {
      this.isLoading = state;
    })
  }
  //#Dates
  selectedProduct!: Product;
  //array di biciclette 
  bikes: Product[] = []
  //array di tipi di biciclette
  bikeTypes: TypeFilter[] = [];
  //array di colori delle biciclette
  bikeColors: ColorFilter[] = [];
  //array di taglie delle biciclette
  bikeSizes: SizeFilter[] = [];
  //Arry fasce di prezzo biciclette
  bikePrices: PriceFilter[] = [];
  //Assegno l'id della parentcategory delle biciclette
  parentCategoryId = 1;
  //Colore selezionato nei filtri
  selectedColor: string | null = null;
  //Tipologia selezionata nei filtri
  selectedType: number | null = null;
  //Taglia selezionata nei filtri
  selectedSize: string | null = null;
  //Prezzo selezionato nei filtri
  selectedPrice: number | null = null;
  //Array di oggetti per i filtri attivi
  activeFilter: { filterType: string; value: any }[] = [];
  //Prodotti paginati
  paginatedProducts: Product[] = [];
  isProductAdded = false;
  //Flag per mostrare il loader
  isLoading = false;
  //Flag per mostrare la pagina vuota prima del caricamento dei dati
  showSkeleton = true;


  //#Function
  //Recupero i filtri dal backend
  getBikeFilters(): void {
    this.loaderService.show();
    this.httpRequest.getProductFilters(this.parentCategoryId)
      .subscribe((response) => {
        // Verifico e assegno i tipi di biciclette
        if (response.types) {
          this.bikeTypes.push(...response.types);
        }
        // Verifica e assegna i colori delle biciclette
        if (response.colors) {
          this.bikeColors.push(...response.colors);
        }
        // Verifica e assegna i colori delle biciclette
        if (response.sizes) {
          this.bikeSizes.push(...response.sizes);
        }
        if (response.prices) {
          this.bikePrices.push(...response.prices);
        }
      }, error => {
        console.error('Errore durante il recupero dei filtri', error);
        this.loaderService.hide();
      });
  }

  //Recupero tutte le biciclette
  getBikes(): void {
    this.httpRequest.getProductsByParentCategory(this.parentCategoryId).subscribe({
      next: (data) => {
        this.bikes = data;
        this.loaderService.hide();
        this.showSkeleton = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.loaderService.hide();
        this.showSkeleton = false;
      },
    });
  }

  //Funzione che aggiorna l'array di biciclette con le biciclette filtrate per colore
  onFilterChange(event: Event, filterType: 'typeId' | 'color' | 'size' | 'price'): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    // Se la checkbox è selezionata
    if (inputElement.checked) {
      // Rimuovo eventuali oggetti dello stesso tipo di filtro
      this.activeFilter = this.activeFilter.filter(filter => filter.filterType !== filterType);
      // Converto il valore nel tipo corretto
      let coercedValue = filterType === 'typeId' || filterType === 'price' ? Number(value) : value;
      // Aggiungo il nuovo filtro attivo
      this.activeFilter.push({ filterType, value: coercedValue });

      // Aggiorno i valori selezionati
      if (filterType === 'color') this.selectedColor = value;
      if (filterType === 'typeId') this.selectedType = Number(value);
      if (filterType === 'size') this.selectedSize = value;
      if (filterType === 'price') this.selectedPrice = Number(value);
    }
    else {
      // Converto il valore nel tipo corretto prima di confrontarlo
      const coercedValue = filterType === 'typeId' || filterType === 'price' ? Number(value) : value;
      // Se la checkbox viene deselezionata, rimuovo quel filtro specifico
      this.activeFilter = this.activeFilter.filter(
        filter => !(filter.filterType === filterType && filter.value === coercedValue)
      );
      // Resetta i valori selezionati
      if (filterType === 'color') this.selectedColor = null;
      if (filterType === 'typeId') this.selectedType = null;
      if (filterType === 'size') this.selectedSize = null;
      if (filterType === 'price') this.selectedPrice = null;
    }
    // Richiesta HTTP per filtrare le biciclette
    this.httpRequest.getFilteredProducts(this.parentCategoryId, this.selectedColor, this.selectedType, this.selectedSize, this.selectedPrice).subscribe({
      next: (data) => {
        this.bikes = data;
        // Imposto la pagina corrente a 1 dopo il filtraggio
        this.paginationService.setCurrentPage(1);
      },
      error: (err) => {
        console.error('Error:', err);
      },
    })
  }

  //Metodo per rimuovere un filtro attivo
  removeFilter(filterType: string) {
    //Resetto i valore in base al tipo di filtro 
    switch (filterType) {
      case 'color': this.selectedColor = null;
        break;
      case 'typeId': this.selectedType = null;
        break;
      case 'size': this.selectedSize = null;
        break;
      case 'price': this.selectedPrice = null;
        break;
      default:
        console.log('Filtro non valido');
    }
    // Richiesta HTTP per filtrare le biciclette
    this.httpRequest.getFilteredProducts(this.parentCategoryId, this.selectedColor, this.selectedType, this.selectedSize, this.selectedPrice).subscribe({
      next: (data) => {
        this.bikes = data;
      },
      error: (err) => {
        console.error('Error:', err);
      },
    })
    //Rimuovo il filtro dall array di filtri attivi
    this.activeFilter = this.activeFilter.filter(filter => filter.filterType !== filterType);
  }

  //Metodo per ricevere i prodotti paginati e assegnarli alla variabile
  onChildNotify(eventData: Product[]): void {
    this.paginatedProducts = eventData;
  }

  //Recupero i filtri e le biciclette all'inizializzazione del componente
  ngOnInit(): void {
    this.getBikeFilters();
    this.getBikes();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Remove modal backdrop on navigation
        $(".modal-backdrop").remove();
      }
    });
  }

  // Metodo per mostrare il dettaglio del prodotto
  async viewProduct(prodotto: Product) {

    this.selectedProduct = prodotto;
    const categoryResponse = await fetch("https://localhost:7257/api/Products/categoryId/" + prodotto.productCategoryId);
    const modelResponse = await fetch("https://localhost:7257/api/Products/modelId/" + prodotto.productModelId);
    const descriptionResponse = await fetch("https://localhost:7257/api/Products/getDescByModelId/" + prodotto.productModelId);
    const category = await categoryResponse.text();
    const model = await modelResponse.text();
    const description = await descriptionResponse.json();

    const Paragraph = document.getElementById("productData") as HTMLParagraphElement;
    Paragraph.innerHTML =
     `
    <div class="container">
      <div class="row">
        <div class="col-12 col-lg-6 d-flex
          align-items-center mb-3 mb-lg-0">
          <img src="data:image/gif;base64,${prodotto.thumbNailPhoto}"
          style="height:150px; width:200px" class = "img-fluid rounded" alt="Immagine">
        </div>
        <div class="col-12 col-lg-6">
          <div class="d-flex flex-column justify-content-start">
            <h2 style="font-size: 27px;">${prodotto.name}</h2>
            <p style="font-size: 15px;">
              <strong>Price:</strong> ${prodotto.listPrice.toFixed(2)}€ <br>
              <strong>Color:</strong> ${prodotto.color || 'N/A'} <br>
              <strong>Size:</strong> ${prodotto.size || '0'} <br>
              <strong>Weight:</strong> ${prodotto.weight || '0'} kg <br>
              <strong>Category:</strong> ${category} <br>
              <strong>Model:</strong> ${model} <br>
            </p>
          </div>
        </div>
      </div>
      <p class="product-description d-none d-md-block" style="font-size: 20px;">${description[0].description}</p>
    </div>
     `;

    const modalElement = document.getElementById('viewProduct');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Modal element not found!');
    }
  }

 
}
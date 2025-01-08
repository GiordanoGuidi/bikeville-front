import { Component,Input,Output,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleChanges } from '@angular/core';
import { Product } from '../../../Models/products';
import { PaginationService } from '../../../service/pagination-service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  constructor(private paginationService: PaginationService) {}

  //# Input per i dati(Popolati dal componente padre)
   @Input() products: Product[] = [];
   paginatedProducts: Product[] = [];
   currentPage = 1;
   itemsPerPage = 20;
   // #Output per eventi(Emissione eventi da componente figlio al padre)
   @Output() getPaginatedProducts = new EventEmitter<Product[]>
 
   // Aggiorna i prodotti per la pagina corrente
   updatePaginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
    console.log(this.paginatedProducts)
    //emetto l'array di prodotti paginati
    this.getPaginatedProducts.emit(this.paginatedProducts);
  }

  // Cambia pagina
  changePage(page: number) {
    this.currentPage = page;
    this.updatePaginatedProducts();
    //Notifico il servizio per modificare il valore
    this.paginationService.setCurrentPage(page);
  }

  // Calcola il numero totale di pagine
  get totalPages() {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }

  //Quando cambia il valore di products eseguo il metodo(bikes
  // è un dato ricevuto da un metodo asincrono)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products'] && this.products) {
      this.updatePaginatedProducts();
    }
  }

  //Iscrizione al servizio
  ngOnInit(): void {
    this.paginationService.currentPage$.subscribe(page => {
        this.currentPage = page;
        this.updatePaginatedProducts();
    });
  }
}

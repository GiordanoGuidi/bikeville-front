import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../shared/Models/products';
import { ProductnologhttpService } from '../../shared/httpservices/productnologhttp.service';
@Component({
  selector: 'app-product-nologin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-nologin.component.html',
  styleUrl: './product-nologin.component.css'
})
export class ProductNologinComponent {
  constructor(private httpRequest: ProductnologhttpService) { }
  products: Product[] = [];
  paginatedProducts: Product[] = [];
  currentPage = 1;
  itemsPerPage = 50;



  // Metodo chiamato automaticamente quando il componente è inizializzato
  ngOnInit(): void {
    this.GetProductNoLog();
  }

  GetProductNoLog() {
    this.httpRequest.getProductnolog().subscribe({
      next: (data) => {
        this.products = data;
        this.updatePaginatedProducts();
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
  }

  // Aggiorna i prodotti per la pagina corrente
  updatePaginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }

  // Cambia pagina
  changePage(page: number) {
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  // Calcola il numero totale di pagine
  get totalPages() {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }
  

}

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



  // Metodo chiamato automaticamente quando il componente è inizializzato
  ngOnInit(): void {
    this.GetProductNoLog();
    
  }

  GetProductNoLog() {
    this.httpRequest.getProductnolog().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
  }

}

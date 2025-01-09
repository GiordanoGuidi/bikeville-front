import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../shared/Models/products';
import { AdminproductshttpService } from '../../../shared/httpservices/adminproductshttp.service';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductDTO } from '../../../shared/Models/productsDTO';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent {
  constructor(private httpRequest: AdminproductshttpService, private router: Router) { 

  }
  products: Product[] = [];
  newProduct : ProductDTO = new ProductDTO();
 
  paginatedProducts: Product[] = [];
  currentProductId : number | null  = null;
  currentPage = 1;
  itemsPerPage = 50;

  ngOnInit(): void {
    this.AdminProducts();
   
    
  }

  AdminProducts() {
    this.httpRequest.getAdminProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.updatePaginatedProducts();
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
  }

//TODO funzione per aggiungere un prodotto//

addProduct(prodotto: NgForm) {
  this.newProduct = prodotto.value;
  console.log(this.newProduct);
  this.httpRequest.postAdminProduct(this.newProduct).subscribe({
    next: (data) => {
      console.log('Product successfully added:', data);
      alert('Product added successfully!');
      this.AdminProducts();
      const modalElement = document.getElementById('addModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.hide();
    } else {
      console.error('Modal element not found!');
    }
    },
    error: (err) => {
      console.error('Errore', err);
      alert('Failed to add product. Check the logs for details.');
    },
  });
}


onFileSelected(event: Event): void {
  const fileInput = event.target as HTMLInputElement;

  if (fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    // Quando il file è stato letto
    reader.onload = () => {
      this.newProduct.thumbNailPhoto = (reader.result as string).split(',')[1]; // Ottieni solo la stringa Base64
    };

    // Leggi il file come una URL data (Base64)
    reader.readAsDataURL(file);
  }
}

//* funzione per visualizzare prodotti ?//

async viewProduct(prodotto: Product) {
    const Paragraph = document.getElementById("productData") as HTMLParagraphElement;

    const categoryResponse = await fetch("https://localhost:7257/api/Products/categoryId/" + prodotto.productCategoryId);
        const modelResponse = await fetch("https://localhost:7257/api/Products/modelId/" + prodotto.productModelId);

        if (!categoryResponse.ok) {
            console.error("Errore nel recupero della categoria");
        }
        if (!modelResponse.ok) {
            console.error("Errore nel recupero del modello");
        }

        const category = await categoryResponse.text();
        const model = await modelResponse.text();
        if (prodotto.size == null) {
          prodotto.size = "";
        }
        if (!prodotto.weight == null) {
          prodotto.weight = 0;
        }

    Paragraph.innerHTML = `
    <strong>Id:</strong> ${prodotto.productId}<br>
    <strong>Name:</strong> ${prodotto.name}<br>
    <strong>Product Number:</strong> ${prodotto.productNumber}<br>
    <strong>Color:</strong> ${prodotto.color}<br>
    <strong>Standard Cost:</strong> ${prodotto.standardCost.toFixed(2)} €<br>
    <strong>List Price:</strong> ${prodotto.listPrice.toFixed(2)} €<br>
    <strong>Size:</strong> ${prodotto.size}<br>
    <strong>Weight:</strong> ${prodotto.weight}<br>
    <strong>Product Category:</strong> ${category}<br>
    <strong>Product Model:</strong> ${model}<br>
    <img src = "image/gif/${prodotto.thumbNailPhoto}"<br>
    `;
    //TODO Verificare percorso immagini prodotti//

    const modalElement = document.getElementById('viewModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Modal element not found!');
    }
  }

//* funzione per modificare prodotti esistenti ?//

async editProduct(prodotto: Product) {
    const categoryResponse = await fetch("https://localhost:7257/api/Products/categoryId/" + prodotto.productCategoryId);
        const modelResponse = await fetch("https://localhost:7257/api/Products/modelId/" + prodotto.productModelId);

        if (!categoryResponse.ok) {
            console.error("Errore nel recupero della categoria");
        }
        if (!modelResponse.ok) {
            console.error("Errore nel recupero del modello");
        }

        const category = await categoryResponse.text();
        const model = await modelResponse.text();

    const Name = document.getElementById("editname") as HTMLInputElement;
    const ProductNumber = document.getElementById("editproductNumber") as HTMLInputElement;
    const Color = document.getElementById("editcolor") as HTMLInputElement;
    const Cost = document.getElementById("editcost") as HTMLInputElement;
    const Price = document.getElementById("editlistPrice") as HTMLInputElement;
    const Size = document.getElementById("editsize") as HTMLInputElement;
    const Weight = document.getElementById("editweight") as HTMLInputElement;
    const Cat = document.getElementById("editcat") as HTMLInputElement;
    const Mod = document.getElementById("editmod") as HTMLInputElement;
    const SellStart = document.getElementById("editsellStartDate") as HTMLInputElement;
    const SellEnd = document.getElementById("editsellEndDate") as HTMLInputElement;
    const Disc = document.getElementById("editdiscontinuedDate") as HTMLInputElement;
    const ThumbFile = document.getElementById("editthumbnailPhotoFileName") as HTMLInputElement;

    if (prodotto.sellStartDate && !(prodotto.sellStartDate instanceof Date)) {
      prodotto.sellStartDate = new Date(prodotto.sellStartDate);
    }
    if (prodotto.sellEndDate && !(prodotto.sellEndDate instanceof Date)) {
      prodotto.sellEndDate = new Date(prodotto.sellEndDate);
    }
    if (prodotto.discontinueDate && !(prodotto.discontinueDate instanceof Date)) {
      prodotto.discontinueDate = new Date(prodotto.discontinueDate);
    }

    Name.value = prodotto.name;
    ProductNumber.value = prodotto.productNumber;
    Color.value = prodotto.color;
    Cost.valueAsNumber = prodotto.standardCost;
    Price.valueAsNumber = prodotto.listPrice;
    Size.value = prodotto.size;
    Weight.valueAsNumber = prodotto.weight;
    Cat.value = category;
    Mod.value = model;
    SellStart.value = prodotto.sellStartDate && !isNaN(prodotto.sellStartDate.getTime()) ? this.removeTimezoneOffset(prodotto.sellStartDate): "";
    SellEnd.value = prodotto.sellEndDate && !isNaN(prodotto.sellEndDate.getTime()) ? this.removeTimezoneOffset(prodotto.sellEndDate): "";
    Disc.value = prodotto.discontinueDate && !isNaN(prodotto.discontinueDate.getTime()) ? this.removeTimezoneOffset(prodotto.discontinueDate): "";
    console.log(SellStart.valueAsDate);
    console.log(SellEnd.valueAsDate);
    console.log(Disc.valueAsDate);
    ThumbFile.value = prodotto.thumbnailPhotoFileName.toString();
  }

//* funzione per aggirare problemi di fuso orario *//

removeTimezoneOffset(date: Date): string {
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);
  
    const year = localDate.getFullYear();
    const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
    const day = localDate.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }



setProductToDelete(productId: number): void{
  this.currentProductId = productId;
}
  
//TODO creare funzione per eliminare prodotto//

deleteProduct(): void {
 
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    if(confirmDeleteButton){
      confirmDeleteButton.addEventListener('click', () => {
        if(confirm('Sei sicuro di voler eliminare questo prodotto?')){
          if(this.currentProductId != null){
          this.httpRequest.deleteAdminProduct(this.currentProductId).subscribe({
            next: (data) => {
              console.log(`Prodotto con ID ${this.currentProductId} eliminato con successo.`, data);
              // Aggiorna la lista dei prodotti o notifica l'utente
              alert('Product removed successfully');
              this.AdminProducts();
              const modalElement = document.getElementById('addModal');
              if (modalElement) {
                  const modal = new bootstrap.Modal(modalElement);
                   modal.hide();
               } else {
                   console.error('Modal element not found!');
               }
            },
            error: (err) => {
              console.error('Errore durante l\'eliminazione:', err);
              // Mostra un messaggio di errore all'utente
              alert('Failed to remove product');
            }
          });
        }
        
        }else{
          console.log('Eliminazione annullata');
        }
      });
    }
    
  
 

  }








//? funzioni di navigazione ?//

  changePage(page: number) {
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  // Calcola il numero totale di pagine
  get totalPages() {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }

  updatePaginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../shared/Models/products';
import { AdminproductshttpService } from '../../../shared/httpservices/adminproductshttp.service';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductDTO } from '../../../shared/Models/productsDTO';
import { UpdatedProduct } from '../../../shared/Models/UpdateProduct';
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
  productId : number = 0;
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
      const modal = new bootstrap.Modal(modalElement) ;
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
      const base64String = (reader.result as string);
      // Rimuove il prefisso data:image/png;base64,
      const base64WithoutPrefix = base64String.split(',')[1];
      this.newProduct.thumbNailPhoto = base64WithoutPrefix; // Ottieni solo la stringa Base64
    };
    console.log(this.newProduct.thumbNailPhoto);
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

//* funzione che popola la scheda che modifica i prodotti esistenti ?//
// CHIEDERE A DAVIDE
async editProduct(prodotto: Product) {
  this.productId = prodotto.productId;
  console.log(this.productId)
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




  
//funzione per eliminare prodotto//

setProductToDelete(productId: number): void{
  this.currentProductId = productId;
}



deleteProduct(): void {
  const modalElement = document.getElementById('deleteModal');

  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);

    // Ascolta l'evento di chiusura della modale
    modalElement.addEventListener('hidden.bs.modal', () => {
      const confirmed = confirm('Sei sicuro di voler eliminare questo prodotto?');
      
      if (confirmed) {
        if (this.currentProductId != null) {
          this.httpRequest.deleteAdminProduct(this.currentProductId).subscribe({
            next: (data) => {
              console.log(`Prodotto con ID ${this.currentProductId} eliminato con successo.`, data);
              alert('Product removed successfully');
              this.AdminProducts(); // Aggiorna la lista dei prodotti
            },
            error: (err) => {
              console.error('Errore durante l\'eliminazione:', err);
              alert('Failed to remove product');
            }
          });
        }
      } else {
        console.log('Eliminazione annullata');
      }
    }, { once: true }); // Esegui il callback solo una volta

    // Chiudi la modale
    modal.hide();
  } else {
    console.error('Modal element not found!');
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

   async editConfirm() {
    try {
      const Name = (document.getElementById("editname") as HTMLInputElement).value;
      const ProductNumber = (document.getElementById("editproductNumber") as HTMLInputElement).value;
      const Color = (document.getElementById("editcolor") as HTMLInputElement).value;
      const StandardCost = (document.getElementById("editcost") as HTMLInputElement).valueAsNumber;
      const ListPrice = (document.getElementById("editlistPrice") as HTMLInputElement).valueAsNumber;
      const Size = (document.getElementById("editsize") as HTMLInputElement).value;
      const Weight = (document.getElementById("editweight") as HTMLInputElement).valueAsNumber;
      const ProductCategory = (document.getElementById("editcat") as HTMLInputElement).value;
      console.log(ProductCategory);
      const ProductModel = (document.getElementById("editmod") as HTMLInputElement).value;
      console.log(ProductModel);
      const SellStartDate = (document.getElementById("editsellStartDate") as HTMLInputElement).value;
      const SellEndDate = (document.getElementById("editsellEndDate") as HTMLInputElement).value;
      const DiscontinuedDate = (document.getElementById("editdiscontinuedDate") as HTMLInputElement).value;
      const ThumbnailPhotoFileName = (document.getElementById("editthumbnailPhotoFileName") as HTMLInputElement).value;
  
      const fileInput = document.getElementById("thumbnailPhoto") as HTMLInputElement;
      let ThumbnailPhoto: string | null = null;
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        ThumbnailPhoto =  this.newProduct.thumbNailPhoto;
      }
  
      const updatedProduct: UpdatedProduct = {
        name: Name || null,
        productNumber: ProductNumber || null,
        color: Color || null,
        standardCost: isNaN(StandardCost) ? null : StandardCost,
        listPrice: isNaN(ListPrice) ? null : ListPrice,
        size: Size || null,
        weight: isNaN(Weight) ? null : Weight,
        productCategory: ProductCategory|| null,
        productModel: ProductModel|| null,
        sellStartDate: SellStartDate ? new Date(SellStartDate) : null,
        sellEndDate: SellEndDate ? new Date(SellEndDate) : null,
        discontinuedDate: DiscontinuedDate ? new Date(DiscontinuedDate) : null,
        thumbnailPhotoFileName: ThumbnailPhotoFileName || null,
        thumbnailPhoto: ThumbnailPhoto || null,
      };
      
      // Chiamata al servizio
      this.httpRequest.updateAdminProduct(this.productId, updatedProduct).subscribe({
        next: () => {
          alert("Modifiche salvate con successo!");
          document.getElementById("editForm")?.onreset;
          const modal = document.getElementById("editModal");
          if (modal) {
            document.getElementById("closeModalButton")?.click();
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
              this.AdminProducts();
          }
          
        },
        error: (err) => {
          console.error("Errore durante il salvataggio:", err);
          alert("Errore durante il salvataggio delle modifiche!");
        },
      });
    } catch (error) {
      console.error("Errore:", error);
      alert("Si è verificato un errore inaspettato durante il salvataggio delle modifiche.");
    }
  }
  
  
  
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../shared/Models/products';
import { AdminproductshttpService } from '../../../shared/httpservices/adminproductshttp.service';
import { Router, NavigationStart } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductDTO } from '../../../shared/Models/productsDTO';
import { UpdatedProduct } from '../../../shared/Models/UpdateProduct';
import { Observable } from 'rxjs';
import { ModalSessionService } from '../../../shared/service/modal-session.service';
import { SessionModalComponent } from '../../../shared/components/session-modal/session-modal/session-modal.component';
import { AlertComponent } from '../../../shared/components/alert/alert/alert.component';
import { AlertService } from '../../../shared/service/alert.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
declare const $: any;


@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule,
     FormsModule, 
     SessionModalComponent, 
     AlertComponent,
     PaginationComponent],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent {
  constructor(private httpRequest: AdminproductshttpService,
    private router: Router,
    private modalService: ModalSessionService,
    private alertService: AlertService,
    public loaderService: LoaderService,
  ) {
  }
  products: Product[] = [];
  newProduct: ProductDTO = new ProductDTO();
  paginatedProducts: Product[] = [];
  productId: number = 0;
  currentProductId: number | null = null;
  //Flag per mostarre l'alert
  showAlert = false;
  //Flag per mostare il loader
  isLoading = false;

  ngOnInit(): void {
    this.AdminProducts();
    //Iscrizione al servizio
    this.alertService.alertState$.subscribe(state => {
      this.showAlert = state.visible;
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Remove modal backdrop on navigation
        $(".modal-backdrop").remove();
      }
    });
    this.loaderService.loading$.subscribe(state => {
      this.isLoading = state;
    })
  }

  //Funzione per caricare i prodotti
  AdminProducts() {
    this.loaderService.show();
    this.httpRequest.getAdminProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loaderService.hide();
      },
      error: (err) => {
        console.error('Error:', err);
        this.loaderService.hide();
      },
    });
  }

  // funzione per aggiungere un prodotto//
  async addProduct(prodotto: NgForm) {
    //Verifico la validità del token
    const tokenCheckResponse = await fetch("https://localhost:7257/api/Customers/ValidateAdminToken", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });
    //Se il token non è valido faccio rieseguire il login
    if (!tokenCheckResponse.ok) {
      console.error("Token non valido o scaduto");
      this.modalService.openModal();
      return;
    }
    this.newProduct = prodotto.value;
    // Aggiungo il prodotto
    this.httpRequest.postAdminProduct(this.newProduct).subscribe({
      next: (data) => {
        this.alertService.showAlert('Product added successfully!', 'ok');
        this.AdminProducts();
        // Chiudo la modale dopo l'aggiunta
        const modalElement = document.getElementById('addModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.hide();
        } else {
          console.error('Modal element not found!');
        }
        //Resetto il campo input file
        const fileInput = document.getElementById("thumbnailPhoto") as HTMLInputElement;
        if(fileInput) fileInput.value = "";
      },
      error: (err) => {
        console.log('Errore', err.response);
        // Se l'errore ha un codice di stato 401 (Unauthorized)
        if (err.status === 401) {
          this.modalService.openModal();
        } else if (err.status === 409) {
          const errorMessage = err.error?.Message || 'Product already exist change Name or ProductNumber';
          // Scrivo il messaggio in console
          console.log(errorMessage);
          // Mostro l'alert
          this.alertService.showAlert('Product already exist change Name or ProductNumber', 'error');
        } else {
          this.alertService.showAlert('Failed to add product', 'error');
        }
      }
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
        // Ottieni solo la stringa Base64
        this.newProduct.thumbNailPhoto = base64WithoutPrefix; 
      };
      // Leggi il file come una URL data (Base64)
      reader.readAsDataURL(file);
    }
  }

  //funzione per visualizzare prodotti //
  async viewProduct(prodotto: Product) {
    const Paragraph = document.getElementById("productData") as HTMLParagraphElement;
    //Verifico la validità del token
    const tokenCheckResponse = await fetch("https://localhost:7257/api/Customers/ValidateAdminToken", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });
    //Se il token non è valido faccio rieseguire il login
    if (!tokenCheckResponse.ok) {
      console.error("Token non valido o scaduto");
      this.modalService.openModal();
      return;
    }

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

    //! Verificare percorso immagini prodotti//
    const modalElement = document.getElementById('viewModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Modal element not found!');
    }
  }

  // funzione che popola la scheda che modifica i prodotti esistenti
  async editProduct(prodotto: Product) {
    //Verifico la validità del token
    const tokenCheckResponse = await fetch("https://localhost:7257/api/Customers/ValidateAdminToken", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });
    //Se il token non è valido faccio rieseguire il login
    if (!tokenCheckResponse.ok) {
      console.error("Token non valido o scaduto");
      this.modalService.openModal();
      return;
    } else {
      // Se il token è valido, mostra la modale "edit"
      const modalElement = document.getElementById('editModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      } else {
        console.error('Modal element not found!');
      }
      this.productId = prodotto.productId;
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
      const productPhoto = document.getElementById("img-thumbnail") as HTMLImageElement;
      
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
      SellStart.value = prodotto.sellStartDate && !isNaN(prodotto.sellStartDate.getTime()) ? this.removeTimezoneOffset(prodotto.sellStartDate) : "";
      SellEnd.value = prodotto.sellEndDate && !isNaN(prodotto.sellEndDate.getTime()) ? this.removeTimezoneOffset(prodotto.sellEndDate) : "";
      Disc.value = prodotto.discontinueDate && !isNaN(prodotto.discontinueDate.getTime()) ? this.removeTimezoneOffset(prodotto.discontinueDate) : "";
      ThumbFile.value = prodotto.thumbnailPhotoFileName.toString();
      //Se nel db è salvata la stringa base64 mostro l'immagine
      if(prodotto.thumbNailPhoto != ""){
        if(productPhoto){
          productPhoto.src = `data:image/png;base64,${prodotto.thumbNailPhoto}`;
        }
      }
      // altriment mostro il placeholder
      else productPhoto.src = 'assets/img-placeholder.jpg';
    }
  }

  // funzione per aggirare problemi di fuso orario //
  removeTimezoneOffset(date: Date): string {
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);
    const year = localDate.getFullYear();
    const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
    const day = localDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  //funzione selezionare il prodotto da eliminare//
  async setProductToDelete(productId: number) {
    //Verifico la validità del token
    const tokenCheckResponse = await fetch("https://localhost:7257/api/Customers/ValidateAdminToken", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });
    //Se il token non è valido faccio rieseguire il login
    if (!tokenCheckResponse.ok) {
      console.error("Token non valido o scaduto");
      this.modalService.openModal();
      return;
    } else {
      // Se il token è valido, mostra la modale "delete"
      const modalElement = document.getElementById('deleteModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    }
    this.currentProductId = productId;
  }

  //Funzione per eliminare un prodotto
  deleteProduct(): void {
    if (this.currentProductId != null) {
      this.httpRequest.deleteAdminProduct(this.currentProductId).subscribe({
        next: (data) => {
          console.log(`Prodotto con ID ${this.currentProductId} eliminato con successo.`, data);
          this.alertService.showAlert('Product removed successfully', 'ok');
          this.AdminProducts(); // Aggiorna la lista dei prodotti
          const modalElement = document.getElementById('deleteModal');
          if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.hide();
          } else {
            console.error('Modal element not found!');
          }
        },
        error: (err) => {
          console.error('Errore durante l\'eliminazione:', err);
          this.alertService.showAlert('Failed to remove product', 'error');
        }
      });
    }
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
        ThumbnailPhoto = this.newProduct.thumbNailPhoto;
      }

      const updatedProduct: UpdatedProduct = {
        name: Name || null,
        productNumber: ProductNumber || null,
        color: Color || null,
        standardCost: isNaN(StandardCost) ? null : StandardCost,
        listPrice: isNaN(ListPrice) ? null : ListPrice,
        size: Size || null,
        weight: isNaN(Weight) ? null : Weight,
        productCategory: ProductCategory || null,
        productModel: ProductModel || null,
        sellStartDate: SellStartDate ? new Date(SellStartDate) : null,
        sellEndDate: SellEndDate ? new Date(SellEndDate) : null,
        discontinuedDate: DiscontinuedDate ? new Date(DiscontinuedDate) : null,
        thumbnailPhotoFileName: ThumbnailPhotoFileName || null,
        thumbnailPhoto: ThumbnailPhoto || null,
      };

      // Chiamata al servizio
      this.httpRequest.updateAdminProduct(this.productId, updatedProduct).subscribe({
        next: () => {
          this.alertService.showAlert('Changes saved successfully !', 'ok');
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
          this.alertService.showAlert('An unexpected error occurred while saving changes.', 'error');
        },
      });
    } catch (error) {
      console.error("Errore:", error);
      this.alertService.showAlert('An unexpected error occurred while saving changes.', 'error');
    }
  }
  //# funzioni per la paginazione e navigazione //
  // Metodo per ricevere l'evento dal figlio sugli utenti da visualizzare
  onChildNotify(newPaginatedProduct : Product[]){
    this.paginatedProducts = newPaginatedProduct;
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';
import { AdmincustomershttpService } from '../../../shared/httpservices/admincustomershttp.service';
import * as bootstrap from 'bootstrap';
import { FormsModule, NgForm } from '@angular/forms';
import { Customer } from '../../../shared/Models/customer';
import { forkJoin } from 'rxjs';
import { UpdateCustomer } from '../../../shared/Models/UpdateCustomer';
import { AlertComponent } from '../../../shared/components/alert/alert/alert.component';
import { AlertService } from '../../../shared/service/alert.service';
import { ModalSessionService } from '../../../shared/service/modal-session.service';
import { SessionModalComponent } from '../../../shared/components/session-modal/session-modal/session-modal.component';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { HttpHeaders } from '@angular/common/http';
import { SkeletonContainerComponent } from '../../../shared/components/skeleton-container/skeleton-container.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
declare const $: any;

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, 
    FormsModule, 
    AlertComponent, 
    SessionModalComponent,
    LoaderComponent,
    SkeletonContainerComponent,
    PaginationComponent],
  templateUrl: './admin-customers.component.html',
  styleUrl: './admin-customers.component.css'
})
export class AdminCustomersComponent {
  constructor(
    private httpRequest: AdmincustomershttpService,
    private router: Router,
    private alertService: AlertService,
    private modalService: ModalSessionService,
    public loaderService: LoaderService
  ) { }
  customers: Customer[] = [];
  paginatedCustomers: Customer[] = [];
  email: string = "";
  customerId: number = 0;
  emailMap: { [key: number]: string } = {};
  customerToDelete: number | null = null;
  //Flag per mostarre l'alert
  showAlert = false;
  //Flag per mostrare o meno illoader
  isLoading = false;
  //Flag per mostrare la pagina vuota prima del caricamento dei dati
  showSkeleton = true;

  ngOnInit(): void {
    this.AdminCustomers();
    this.alertService.alertState$.subscribe(state => {
      this.showAlert = state.visible;
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        $(".modal-backdrop").remove();
      }
    });
    // Iscriviti per ricevere aggiornamenti sullo stato del loader
    this.loaderService.loading$.subscribe(state => {
      this.isLoading = state;
    });
  }

  //Recupero gli Utenti
  AdminCustomers() {
    //Mostro il loader
    this.loaderService.show();
    this.httpRequest.getAdminCustomers({ headers: new HttpHeaders({ 'Skip-Loader': 'true' }) }).subscribe({
      next: (data) => {
        this.customers = data;
        this.preloadEmails(data);
        // this.updatePaginatedCustomers();
        this.showSkeleton = false;
      },

      error: (err) => {
        console.error('Error:', err);
        this.loaderService.hide();
      },
    });
  }

  //Recupero le email degli utenti
  preloadEmails(customers: any[]) {
    const emailRequests = customers.map((customer) =>
      this.httpRequest.getMail(customer.customerId, { headers: new HttpHeaders({ 'Skip-Loader': 'true' }) }));
    forkJoin(emailRequests).subscribe({
      next: (emails) => {
        customers.forEach((customer, index) => {
          customer.emailAddress = emails[index];
          this.emailMap[customer.customerId] = emails[index];
        });
        // this.updatePaginatedCustomers();
        //Nascondo il loader
        this.loaderService.hide();
      },
      error: (err) => {
        console.error('Error in preloadEmails:', err);
        this.loaderService.hide();
      },
    });
  }

  // Mostro il dettaglio dell'utente
  async viewCustomer(customer: Customer) {
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
    const Paragraph = document.getElementById("customerData") as HTMLParagraphElement;

    Paragraph.innerHTML = `
      <strong>Id:</strong> ${customer.customerId}<br>
      <strong>Full Name:</strong> ${customer.title || ''} ${customer.firstName || ''} ${customer.middleName || ''} ${customer.lastName || ''} ${customer.suffix || ''}<br>
      <strong>Company:</strong> ${customer.companyName}<br>
      <strong>Email:</strong> ${customer.emailAddress}<br>
      <strong>Phone:</strong> ${customer.phone}<br>
      `;

    const modalElement = document.getElementById('viewModal');
    if (modalElement) {
      // Creata istanza del componente modal
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Modal element not found!');
    }
  }

  //Funzione per popolare il form di modifica con i dati dell'utente
  async editCustomer(customer: Customer) {
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
    const modalElement = document.getElementById('editModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Modal element not found!');
    }
    this.customerId = customer.customerId;

    const Title = document.getElementById("edittitle") as HTMLInputElement;
    const FirstName = document.getElementById("editfirstname") as HTMLInputElement;
    const MiddleName = document.getElementById("editmiddlename") as HTMLInputElement;
    const LastName = document.getElementById("editlastname") as HTMLInputElement;
    const Suffix = document.getElementById("editsuffix") as HTMLInputElement;
    const Company = document.getElementById("editcompany") as HTMLInputElement;
    const Email = document.getElementById("editemail") as HTMLInputElement;
    const Phone = document.getElementById("editphone") as HTMLInputElement;

    // Popolo i campi input con i dati dell'utente
    Title.value = customer.title;
    FirstName.value = customer.firstName;
    MiddleName.value = customer.middleName;
    LastName.value = customer.lastName;
    Suffix.value = customer.suffix;
    Company.value = customer.companyName;
    Email.value = customer.emailAddress;
    Phone.value = customer.phone;
  }

  //Funzione per eseguire l'update del customer
  async ConfirmEditCustomer() {
    try {
      // Recupera i valori dal form
      const Title = (document.getElementById("edittitle") as HTMLInputElement).value;
      const FirstName = (document.getElementById("editfirstname") as HTMLInputElement).value;
      const MiddleName = (document.getElementById("editmiddlename") as HTMLInputElement).value;
      const LastName = (document.getElementById("editlastname") as HTMLInputElement).value;
      const Suffix = (document.getElementById("editsuffix") as HTMLInputElement).value;
      const Company = (document.getElementById("editcompany") as HTMLInputElement).value;
      const Email = (document.getElementById("editemail") as HTMLInputElement).value;
      const Phone = (document.getElementById("editphone") as HTMLInputElement).value;

      // Crea l'oggetto updatedCustomer
      const updatedCustomer: UpdateCustomer = {
        title: Title || null,
        firstName: FirstName || null,
        middleName: MiddleName || null,
        lastName: LastName || null,
        suffix: Suffix || null,
        companyName: Company || null,
        emailAddress: Email || null,
        phone: Phone || null,
      };

      // Invio della richiesta al server
      this.httpRequest.updateAdminCustomers(this.customerId, updatedCustomer).subscribe({
        next: () => {
          this.alertService.showAlert('Changes saved successfully !', 'ok');
          document.getElementById("editForm")?.onreset;
          const modal = document.getElementById("editModal");
          if (modal) {
            document.getElementById("closeModalButton")?.click();
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            this.AdminCustomers(); // Aggiorna i dati
          }
        },
        error: (err) => {
          // Gestione dell'errore
          if (err.status === 409) { // Assumi che 409 sia restituito in caso di email duplicata
            alert("Email already exist, retry.");
          } else {
            this.alertService.showAlert('An unexpected error occurred while saving changes.', 'error');
          }
          console.error("Errore:", err);
        }
      });
    } catch (error) {
      console.error("Errore:", error);
      this.alertService.showAlert('An unexpected error occurred while saving changes.', 'ok');
    }
  }

  //Funzione per recuperare l'id dell'utente da eliminare
  async setCustomerToDelete(customerId: number) {
    this.customerToDelete = customerId;
  }

  //Funzione per eliminare un utente
  async deleteCustomer() {
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
    if (this.customerToDelete != null) {
      this.httpRequest.deleteAdminCustomer(this.customerToDelete).subscribe({
        next: (data) => {
          this.alertService.showAlert('Customer removed successfully', 'ok');
          // Aggiorna la lista degli utenti
          this.AdminCustomers();
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
          // Mostra un messaggio di errore all'utente
          this.alertService.showAlert('Failed to remove customer', 'error');
        }
      });
    }
  }

  //# funzioni per la paginazione //
  // Metodo per ricevere l'evento dal figlio sugli utenti da visualizzare
  onChildNotify(newPaginatedCustomer : Customer[]){
    this.paginatedCustomers = newPaginatedCustomer;
  }
}

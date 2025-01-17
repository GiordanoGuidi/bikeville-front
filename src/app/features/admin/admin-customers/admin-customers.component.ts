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
declare const $: any;

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule,AlertComponent,SessionModalComponent],
  templateUrl: './admin-customers.component.html',
  styleUrl: './admin-customers.component.css'
})
export class AdminCustomersComponent {
    constructor(private httpRequest: AdmincustomershttpService,
       private router: Router,
       private alertService:AlertService,
       private modalService:ModalSessionService
      ) { }
    customers: Customer[] = [];
    paginatedCustomers: Customer[] = [];
    email: string = "";
    currentPage = 1;
    customerId : number = 0;
    itemsPerPage = 50;
    emailMap: { [key: number]: string } = {};
    customerToDelete: number | null = null;
    //Flag per mostarre l'alert
    showAlert = false;

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
    }

    AdminCustomers() {
      this.httpRequest.getAdminCustomers().subscribe({
        next: (data) => {
          this.customers = data;
          this.preloadEmails(data);
          this.updatePaginatedCustomers();
        },
        error: (err) => {
          console.error('Error:', err);
        },
      });
    }


   preloadEmails(customers: any[]) {
      const emailRequests = customers.map((customer) => this.httpRequest.getMail(customer.customerId));
      forkJoin(emailRequests).subscribe({
        next: (emails) => {
          customers.forEach((customer, index) => {
            customer.emailAddress = emails[index];
            this.emailMap[customer.customerId] = emails[index];
          });
          this.updatePaginatedCustomers();
        },
        error: (err) => {
          console.error('Error in preloadEmails:', err);
        },
      });
    }

    getEmail(customerId: number): string {
      return this.emailMap[customerId] || 'Loading...';
    }

    changePage(page: number) {
      this.currentPage = page;
      this.updatePaginatedCustomers();
    }

    get totalPages() {
      return Math.ceil(this.customers.length / this.itemsPerPage);
    }
  
    updatePaginatedCustomers() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedCustomers = this.customers.slice(startIndex, endIndex);
    }

  async viewCustomer(cliente: Customer) {
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
      <strong>Id:</strong> ${cliente.customerId}<br>
      <strong>Full Name:</strong> ${cliente.title || ''} ${cliente.firstName || ''} ${cliente.middleName || ''} ${cliente.lastName || ''} ${cliente.suffix || ''}<br>
      <strong>Company:</strong> ${cliente.companyName}<br>
      <strong>Email:</strong> ${cliente.emailAddress}<br>
      <strong>Phone:</strong> ${cliente.phone}<br>
      `;

    const modalElement = document.getElementById('viewModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Modal element not found!');
    }
  }

  async editCustomer(cliente: Customer) {
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
    this.customerId = cliente.customerId;
    console.log(cliente.customerId);

    const Title = document.getElementById("edittitle") as HTMLInputElement;
    const FirstName = document.getElementById("editfirstname") as HTMLInputElement;
    const MiddleName = document.getElementById("editmiddlename") as HTMLInputElement;
    const LastName = document.getElementById("editlastname") as HTMLInputElement;
    const Suffix = document.getElementById("editsuffix") as HTMLInputElement;
    const Company = document.getElementById("editcompany") as HTMLInputElement;
    const Email = document.getElementById("editemail") as HTMLInputElement;
    const Phone = document.getElementById("editphone") as HTMLInputElement;

    Title.value = cliente.title;
    FirstName.value = cliente.firstName;
    MiddleName.value = cliente.middleName;
    LastName.value = cliente.lastName;
    Suffix.value = cliente.suffix;
    Company.value = cliente.companyName;
    Email.value = cliente.emailAddress;
    Phone.value = cliente.phone;
  }

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
            this.alertService.showAlert('Modifiche salvate con successo!', 'ok');
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
              alert("Email già in uso, riprovare.");
            } else {
            this.alertService.showAlert('Si è verificato un errore durante il salvataggio delle modifiche.', 'error');
            }
            console.error("Errore:", err);
          }
        });
      } catch (error) {
        console.error("Errore:", error);
        this.alertService.showAlert('Si è verificato un errore inaspettato durante il salvataggio delle modifiche.', 'ok');
      }
    }


  async setCustomerToDelete(customerId: number) {
    this.customerToDelete = customerId;
  }

  
    async deleteCustomer(){
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
      if(this.customerToDelete != null){
        this.httpRequest.deleteAdminCustomer(this.customerToDelete).subscribe({
          next: (data) => {
            console.log(`Prodotto con ID ${this.customerToDelete} eliminato con successo.`, data);
            
            // Aggiorna la lista dei prodotti o notifica l'utente
            this.alertService.showAlert('Customer removed successfully', 'ok');
            alert('Customer removed successfully');
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
            alert('Failed to remove product');
          }
        }); 
      }
    }
}

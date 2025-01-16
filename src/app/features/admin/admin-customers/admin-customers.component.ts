import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';
import { AdmincustomershttpService } from '../../../shared/httpservices/admincustomershttp.service';
import * as bootstrap from 'bootstrap';
import { FormsModule, NgForm } from '@angular/forms';
import { Customer } from '../../../shared/Models/customer';
import { forkJoin } from 'rxjs';
import { UpdateCustomer } from '../../../shared/Models/UpdateCustomer';
declare const $: any;

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-customers.component.html',
  styleUrl: './admin-customers.component.css'
})
export class AdminCustomersComponent {
    constructor(private httpRequest: AdmincustomershttpService, private router: Router) { }
    customers: Customer[] = [];
    paginatedCustomers: Customer[] = [];
    email: string = "";
    currentPage = 1;
    customerId : number = 0;
    itemsPerPage = 50;
    emailMap: { [key: number]: string } = {};

    ngOnInit(): void {
      this.AdminCustomers();
      this.router.events.subscribe(event => {
                if (event instanceof NavigationStart) {
                  // Remove modal backdrop on navigation
                  $(".modal-backdrop").remove();
                }
              });
    }

    AdminCustomers() {
      this.httpRequest.getAdminCustomers().subscribe({
        next: (data) => {
          this.customers = data;
        //  this.preloadEmails(data); // Precarica le email
        this.updatePaginatedCustomers();
        },
        error: (err) => {
          console.error('Error:', err);
        },
      });
    }


    preloadEmails(customers: any[]) {
      const emailRequests = customers.map((customer) =>
        this.httpRequest.getMail(customer.customerId)
      );
  
      // Esegui tutte le richieste HTTP in parallelo
      forkJoin(emailRequests).subscribe({
        next: (emails) => {
          // Associa ogni email al rispettivo cliente
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

    viewCustomer(cliente: Customer) {
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

    editCustomer(cliente: Customer) {
      this.customerId = cliente.customerId;
      console.log( cliente.customerId);
      
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
            alert("Modifiche salvate con successo!");
            document.getElementById("editForm")?.onreset; // Resetta il form
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
              alert("Si è verificato un errore durante il salvataggio delle modifiche.");
            }
            console.error("Errore:", err);
          }
        });
      } catch (error) {
        console.error("Errore:", error);
        alert("Si è verificato un errore inaspettato durante il salvataggio delle modifiche.");
      }
    }
    
  
    deleteCustomer(cliente: Customer){
    
    }
}

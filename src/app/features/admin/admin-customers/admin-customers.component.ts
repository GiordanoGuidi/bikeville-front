import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdmincustomershttpService } from '../../../shared/httpservices/admincustomershttp.service';
import * as bootstrap from 'bootstrap';
import { FormsModule, NgForm } from '@angular/forms';
import { Customer } from '../../../shared/Models/customer';
import { forkJoin } from 'rxjs';

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
    itemsPerPage = 50;
    emailMap: { [key: number]: string } = {};

    ngOnInit(): void {
      this.AdminCustomers();
    }

    AdminCustomers() {
      this.httpRequest.getAdminCustomers().subscribe({
        next: (data) => {
          this.customers = data;
          this.preloadEmails(data); // Precarica le email
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
      <strong>Sales Person:</strong> ${cliente.salesPerson}<br>
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
      const Title = document.getElementById("edittitle") as HTMLInputElement;
      const FirstName = document.getElementById("editfirstname") as HTMLInputElement;
      const MiddleName = document.getElementById("editmiddlename") as HTMLInputElement;
      const LastName = document.getElementById("editlastname") as HTMLInputElement;
      const Suffix = document.getElementById("editsuffix") as HTMLInputElement;
      const Company = document.getElementById("editcompany") as HTMLInputElement;
      const Email = document.getElementById("editemail") as HTMLInputElement;
      const Phone = document.getElementById("editphone") as HTMLInputElement;
      const SalesPerson = document.getElementById("editsalesperson") as HTMLInputElement;

      Title.value = cliente.title;
      FirstName.value = cliente.firstName;
      MiddleName.value = cliente.middleName;
      LastName.value = cliente.lastName;
      Suffix.value = cliente.suffix;
      Company.value = cliente.companyName;
      Email.value = cliente.emailAddress;
      Phone.value = cliente.phone;
      SalesPerson.value = cliente.salesPerson;
    }

    deleteCustomer(cliente: Customer){
    
    }
}

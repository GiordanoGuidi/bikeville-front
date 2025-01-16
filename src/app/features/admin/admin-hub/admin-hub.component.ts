import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalSessionService } from '../../../shared/service/modal-session.service';
import { Router } from '@angular/router';
import { SessionModalComponent } from '../../../shared/components/session-modal/session-modal/session-modal.component';
@Component({
  selector: 'app-admin-hub',
  standalone: true,
  imports: [RouterModule,SessionModalComponent],
  templateUrl: './admin-hub.component.html',
  styleUrl: './admin-hub.component.css'
})
export class AdminHubComponent {
   constructor(private router: Router,
      private modalService:ModalSessionService,
    ) { }

  //Metodo per mostrare tutti i customers
  async redirectToCustomers(){
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
      }else{
        // Se il token è valido, mostra la modale "edit"
        this.router.navigate(['/admincustomers'])
    }
  }
  
  //Metodo per mostrare tutti i prodotti
  async redirectToProducts(){
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
    }else{
      // Se il token è valido, mostra la modale "edit"
      this.router.navigate(['/adminproducts'])
  }
  }
}

import { Component, OnInit } from '@angular/core';
import { ModalSessionService } from '../../../service/modal-session.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-session-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-modal.component.html',
  styleUrl: './session-modal.component.css'
})
export class SessionModalComponent {
    // Variabile per gestire lo stato della visibilità della modale
  isModalOpen = false;
  constructor(private modalService: ModalSessionService, private router: Router) {}

  ngOnInit() {
    // Iscrizione per sincronizzare la visibilità della modale
    this.modalService.modalState$.subscribe((state) => {
      this.isModalOpen = state;
    });
  }

  // Metodo per redirigere a Login
  redirectToLogin() {
    // Chiudo la modale
    this.modalService.closeModal(); 
    // Redireziono alla pagina di login
    this.router.navigate(['/login']); 
  }
  // Metodo per chiudere la modale
  closeModal() {
    this.modalService.closeModal();
    // aggiunto router che rimanda in home//
    this.router.navigate(['/home']);
  }
  
}

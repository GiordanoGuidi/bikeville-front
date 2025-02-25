import { Component,Input,Output,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleChanges } from '@angular/core';
import { Product } from '../../Models/products';
import { PaginationService } from '../../service/pagination-service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent<T> {
  constructor(private paginationService: PaginationService) {}

  //# Input per i dati(Popolati dal componente padre)
   @Input() entities: T[] = [];
   paginatedEntities: T[] = [];
   currentPage = 1;
   itemsPerPage = 10;
   // #Output per eventi(Emissione eventi da componente figlio al padre)
   @Output() getPaginatedEntities = new EventEmitter<T[]>();
 
   // Aggiorna i prodotti per la pagina corrente
   updatePaginatedEntities() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEntities = this.entities.slice(startIndex, endIndex);
    //emetto l'array di prodotti paginati
    this.getPaginatedEntities.emit(this.paginatedEntities);
  }

  // Cambia pagina
  changePage(page: number) {
    this.currentPage = page;
    this.updatePaginatedEntities();
    //Notifico il servizio per modificare il valore
    this.paginationService.setCurrentPage(page);
  }

  // Calcola il numero totale di pagine
  get totalPages() {
    return Math.ceil(this.entities.length / this.itemsPerPage);
  }

  //Quando cambia il valore di entities eseguo il metodo
  // è un dato ricevuto da un metodo asincrono)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entities'] && this.entities) {
      this.updatePaginatedEntities();
    }
  }

  //Iscrizione al servizio
  ngOnInit(): void {
    this.paginationService.currentPage$.subscribe(page => {
        this.currentPage = page;
        this.updatePaginatedEntities();
    });
  }

  visiblePages(): number[]{
    const total = this.totalPages;
    // Numero massimo di pagine visibili
    const maxVisible = 5;
    let start = Math.max(1,this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(total,start + maxVisible - 1);
    // Se siamo vicini alla fine, spostiamo l'intervallo all'indietro
    if(end - start < maxVisible -1){
      start = Math.max(1, end - maxVisible +1);
    }
    return Array.from({length: end - start +1},(_,i)=> start + i);
  }
}

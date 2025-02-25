import { Component,Input,Output,EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from '../../Models/customer';
@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input()currentPage :number = 1;
  paginatedCustomers : Customer[] = [];
  //Valori ricevuti dal componente padre
  @Input() itemsPerPage : number = 10;
  @Input() customers : Customer[] = [];
  // Output per notificare il padre
  @Output() pageChanged = new EventEmitter<Customer[]>();
  @Output() newPage = new EventEmitter <number>();

  get totalPages() {
    return Math.ceil(this.customers.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if(page>= 1 && page <= this.totalPages){
      this.currentPage = page;
    }
    this.newPage.emit(this.currentPage)
    this.updatePaginatedCustomers();
  }

  updatePaginatedCustomers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCustomers = this.customers.slice(startIndex, endIndex);
    //Notifica il padre con i nuovi dati
    this.pageChanged.emit(this.paginatedCustomers);
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

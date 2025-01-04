import { Component,Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  //# Input per i dati(Popolati dal componente padre)
  @Input() title!: string;
  @Input() types: { id: number; name: string }[] = [];
  @Input() colors: { color: string }[] = [];
  @Input() sizes: { size: string }[] = [];
  @Input() prices: { id: number; label: string }[] = [];
  @Input() parentCategoryId!:number;

  // Array filtri attivi
  @Input() activeFilter: { filterType: string; value: any }[] = [];

  // #Output per eventi(Emissione eventi da componente figlio al padre)
  //filterChange  emetterà un oggetto contenete l'evento e il filterTypes
  @Output() filterChange = new EventEmitter<{ event: Event; filterType: 'typeId' | 'color' | 'size' | 'price' }>();
  @Output() removeFilter = new EventEmitter<string>();

  //# Funzioni utilitarie
  isFilterActive(filterType: string, value: any): boolean {
    return this.activeFilter.some(filter => filter.filterType === filterType && filter.value === value);
  }

  //Metodo che restituisce la stringa di tipologia di bicicletta dal suo id
  getActiveFilter(value: number,parentCategoryId:number): string|number {
  //Parentcategory delle Biciclette
  if(parentCategoryId==1){
      const typeMap1: { [key: number]: string } = {
        1: 'Up to 700€',
        2: '700-1500€',
        3: '1500-2500€',
        4: '2500€ and more',
      };
      const typeMap2: { [key: number]: string } = {
        5: 'Mountain Bikes',
        6: 'Road Bikes',
        7: 'Touring Bikes'
      };
      switch (true) {
        case value >= 1 && value <= 4:
          return typeMap1[value as number] || 'Unknown Type';
        case value >= 5 && value <= 7:
          return typeMap2[value as number] || 'Unknown Type';
        default:
          return value;
      }
    }
  //Parentcategory dei componenti
    else if(parentCategoryId==2){
      const typeMap1: { [key: number]: string } = {
        1: 'Up to 100€',
        2: '100-500€',
        3: '500-1000€',
        4: '1000€ and more',
      };
      const typeMap2: { [key: number]: string } = {
        8: 'Handlebars',
        9: 'Bottom Brackets',
        10: 'Brakes',
        11: 'Chains',
        12: 'Cranksets',
        13: 'Derailleurs',
        14: 'Forks',
        15: 'Headsets',
        16: 'Mountain Frames',
        17: 'Pedals',
        18: 'Road Frames',
        19: 'Saddles',
        20: 'Touring Frames',
        21: 'Wheels',
      };
      switch (true) {
        case value >= 1 && value <= 4:
          return typeMap1[value as number] || 'Unknown Type';
        case value >= 8 && value <= 21:
          return typeMap2[value as number] || 'Unknown Type';
        default:
          return value;
      }
    }

    return 'Unknown Type';
  }
  //Metodo per restituire una stringa in minuscolo
  toLower(input: string): string {
    return input.replace(/\//g, '-').toLowerCase();
  }
}
   

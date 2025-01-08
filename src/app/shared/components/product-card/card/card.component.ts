import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../Models/products';
import { ProductnologhttpService } from '../../../httpservices/productnologhttp.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  //# Input per i dati(Popolati dal componente padre)
  @Input()product!:Product;
}

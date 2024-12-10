import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  isHidden = false; // Stato iniziale del footer (visibile)

  private lastScrollY = 0;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const currentScrollY = window.scrollY;

    // Mostra o nascondi il footer in base al movimento dello scroll
    this.isHidden = currentScrollY > this.lastScrollY && currentScrollY > 100;
    this.lastScrollY = currentScrollY;
  }
}
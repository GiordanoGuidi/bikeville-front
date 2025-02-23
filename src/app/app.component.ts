import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './core/navbar/navbar.component';
import { FooterComponent } from "./core/footer/footer.component";
import { Router } from '@angular/router';
import { CartComponent } from './features/cart/cart.component';
import { FormsModule } from '@angular/forms';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { LoaderService } from './shared/loader/loader.service';
import { Observable } from 'rxjs';
import { LoaderComponent } from './shared/loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule, CartComponent, FormsModule, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'bikeville-front';
  constructor(
    private router: Router,
    public loaderService: LoaderService
  ) {
  }

  // ogni volta che viene aperta la pagina iniziale dell'app c'è un redirect alla home
  ngOnInit(): void {
    this.router.navigate(['/home']);
  }
}

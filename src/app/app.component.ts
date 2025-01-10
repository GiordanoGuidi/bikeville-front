import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './core/navbar/navbar.component';
import { FooterComponent } from "./core/footer/footer.component";
import { Router } from '@angular/router';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent,FooterComponent,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  constructor(private router: Router) {}
  title = 'bikeville-front';
  
  // ogni volta che viene aperta la pagina iniziale dell'app c'è un redirect alla home//
  ngOnInit(): void {
    this.router.navigate(['/home']);
  }
}

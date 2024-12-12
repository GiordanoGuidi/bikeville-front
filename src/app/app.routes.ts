import { Routes } from '@angular/router';
import { LoginComponent } from './core/login/login.component';
import { LogoutComponent } from './core/logout/logout.component';
import { AppComponent } from './app.component';
import { RegisterComponent } from './core/register/register.component';
import { ProductNologinComponent } from './features/product-nologin/product-nologin.component';
import { AdminProductsComponent } from './features/admin/admin-products/admin-products.component';
import { HomeComponent } from './core/home/home.component';

export const routes: Routes = [
    {path:'register',component:RegisterComponent},
    {path:'login',component:LoginComponent},
    {path:'logout',component:LogoutComponent},
    {path:'products',component:LogoutComponent},
    {path:'product-nologin',component:ProductNologinComponent},
    {path:'adminproducts',component:AdminProductsComponent},
    {path:'home',component:HomeComponent},

];

//? aggiunti routing per pagina prodotti admin e home ?//
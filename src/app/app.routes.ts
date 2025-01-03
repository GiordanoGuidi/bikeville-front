import { Routes} from '@angular/router';
import { LoginComponent } from './core/login/login.component';
import { LogoutComponent } from './core/logout/logout.component';
import { AppComponent } from './app.component';
import { RegisterComponent } from './core/register/register.component';
import { ProductNologinComponent } from './features/product-nologin/product-nologin.component';
import { AdminProductsComponent } from './features/admin/admin-products/admin-products.component';
import { HomeComponent } from './core/home/home.component';
import { BikesComponent } from './features/products/bikes/bikes.component';
import { ComponentsComponent } from './features/products/components/components.component';
import { ClothingComponent } from './features/products/clothing/clothing.component';
import { AccessoriesComponent } from './features/products/accessories/accessories.component';

export const routes: Routes = [
    {path:'register',component:RegisterComponent},
    {path:'login',component:LoginComponent},
    {path:'logout',component:LogoutComponent},
    {path:'products',component:LogoutComponent},
    {path:'product-nologin',component:ProductNologinComponent},
    {path:'adminproducts',component:AdminProductsComponent},
    {path:'home',component:HomeComponent},
    {path:'Bikes',component:BikesComponent},
    {path:'Components',component:ComponentsComponent},
    {path:'Clothing',component:ClothingComponent},
    {path:'Accessories',component:AccessoriesComponent},
];
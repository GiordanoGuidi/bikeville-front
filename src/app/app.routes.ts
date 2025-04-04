import { Routes} from '@angular/router';
import { LoginComponent } from './core/login/login.component';
import { RegisterComponent } from './core/register/register.component';
import { AdminProductsComponent } from './features/admin/admin-products/admin-products.component';
import { HomeComponent } from './core/home/home.component';
import { BikesComponent } from './features/products/bikes/bikes.component';
import { BikeComponentsComponent } from './features/products/bike-components/bike-components.component';
import { ClothingComponent } from './features/products/clothing/clothing.component';
import { AccessoriesComponent } from './features/products/accessories/accessories.component';
import { AdminCustomersComponent } from './features/admin/admin-customers/admin-customers.component';
import { AdminHubComponent } from './features/admin/admin-hub/admin-hub.component';

export const routes: Routes = [
    {path:'register',component:RegisterComponent},
    {path:'login',component:LoginComponent},
    {path:'adminproducts',component:AdminProductsComponent},
    {path:'home',component:HomeComponent},
    {path:'Bikes',component:BikesComponent},
    {path:'Components',component:BikeComponentsComponent},
    {path:'Clothing',component:ClothingComponent},
    {path:'Accessories',component:AccessoriesComponent},
    {path:'admincustomers',component:AdminCustomersComponent},
    {path:'adminhub',component:AdminHubComponent},

];
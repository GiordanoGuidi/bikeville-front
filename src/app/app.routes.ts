import { Routes } from '@angular/router';
import { LoginComponent } from './core/login/login.component';
import { LogoutComponent } from './core/logout/logout.component';
import { AppComponent } from './app.component';
import { RegisterComponent } from './core/register/register.component';
export const routes: Routes = [
    {path:'register',component:RegisterComponent},
    {path:'login',component:LoginComponent},
    {path:'logout',component:LogoutComponent},
    {path:'products',component:LogoutComponent},
];

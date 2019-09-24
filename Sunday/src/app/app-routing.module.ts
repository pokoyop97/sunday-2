import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { InsideComponent } from './inside/inside.component';
import { RegisterComponent } from './register/register.component'
import { registerLocaleData } from '@angular/common';



const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch:'full'},
  {path: 'login', component: LoginComponent, pathMatch: 'full', },
  {path: 'refi',component: InsideComponent,pathMatch:'full'},
  {path: 'register', component: RegisterComponent, pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

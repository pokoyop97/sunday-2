import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { HomeComponent } from './modules/home/home.component';
import { InsideComponent } from './modules/inside/inside.component';
import { RegisterComponent } from './modules/register/register.component'
import { registerLocaleData } from '@angular/common';
import { ChecarComponent } from './modules/checar/checar.component';
import { ProyectosCrearComponent } from './modules/proyectos-crear/proyectos-crear.component'
import { ProyectosComponent } from './modules/proyectos/proyectos.component';
import { MiembrosComponent } from './modules/miembros/miembros.component';
import { TareasComponent } from './modules/tareas/tareas.component';


const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch:'full'},
  {path: 'login', component: LoginComponent, pathMatch: 'full', },
  {path: 'refi',component: InsideComponent,pathMatch:'full'},
  {path: 'register', component: RegisterComponent, pathMatch:'full'},
  {path: 'pruebas', component: ChecarComponent, pathMatch:'full'},
  {path: 'create', component: ProyectosCrearComponent, pathMatch:'full'},
  {path: 'proyectos', component: ProyectosComponent, pathMatch:'full'},
  {path: 'miembros', component: MiembrosComponent, pathMatch:'full'},
  {path: 'tareas', component: TareasComponent, pathMatch:'full'},
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

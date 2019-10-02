import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { InsideComponent } from './inside/inside.component';
import { RegisterComponent } from './register/register.component'
import { registerLocaleData } from '@angular/common';
import { ChecarComponent } from './checar/checar.component';
import { ProyectosCrearComponent } from './proyectos-crear/proyectos-crear.component'
import { ProyectosComponent } from './proyectos/proyectos.component';
import { MiembrosComponent } from './miembros/miembros.component';
import { TareasComponent } from './tareas/tareas.component';


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
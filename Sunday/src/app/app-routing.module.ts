import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { InsideComponent } from './inside/inside.component';
import { RegisterComponent } from './register/register.component'
import { ProyectosCrearComponent } from './proyectos-crear/proyectos-crear.component'
import { ProyectosComponent } from './proyectos/proyectos.component';
import { MiembrosComponent } from './miembros/miembros.component';
import { TareasComponent } from './tareas/tareas.component';
import { ChatComponent }from './chat/chat.component'
import { UnirseComponent } from './unirse/unirse.component';
import { ProyectosCrearUnidoComponent } from './proyectos-crear-unido/proyectos-crear-unido.component'

/* ---------------------------------------------------------------ssd--------------------------------------------------------------- */
import { UnoComponent } from './ssd/uno/uno.component'
/* ---------------------------------------------------------------ssd--------------------------------------------------------------- */


const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch:'full'},
  {path: 'login', component: LoginComponent, pathMatch: 'full', },
  {path: 'refi',component: InsideComponent,pathMatch:'full'},
  {path: 'register', component: RegisterComponent, pathMatch:'full'},
  {path: 'create', component: ProyectosCrearComponent, pathMatch:'full'},
  {path: 'create-unido', component: ProyectosCrearUnidoComponent, pathMatch:'full'},
  {path: 'proyectos', component: ProyectosComponent, pathMatch:'full'},
  {path: 'miembros', component: MiembrosComponent, pathMatch:'full'},
  {path: 'tareas', component: TareasComponent, pathMatch:'full'},
  {path: 'chat', component: ChatComponent, pathMatch:'full'},
  {path: 'unirse', component: UnirseComponent},
  {path: 'unirse/:idProyecto/:idRol/:email', component: UnirseComponent},

  /* ---------------------------------------------------------------ssd--------------------------------------------------------------- */
  {path: '1', component: UnoComponent, pathMatch:'full'},
  /* ---------------------------------------------------------------ssd--------------------------------------------------------------- */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

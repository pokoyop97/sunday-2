import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { InsideComponent } from './inside/inside.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';

import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorageModule, StorageBucket } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { RegisterComponent } from './register/register.component';
import { ChecarComponent } from './checar/checar.component';
import { MiembrosComponent } from './miembros/miembros.component';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { TareasComponent } from './tareas/tareas.component';
import { ProyectosCrearComponent } from './proyectos-crear/proyectos-crear.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HomeComponent,
    InsideComponent,
    LoginComponent,
    NavbarComponent,
    RegisterComponent,
    ChecarComponent,
    MiembrosComponent,
    ProyectosComponent,
    TareasComponent,
    ProyectosCrearComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule,
    BrowserModule,
    AppRoutingModule,
    ButtonModule,  
    DropdownModule,  
    FormsModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    CalendarModule,
  ],
  providers: [AngularFireAuth, AngularFirestore,{provide: StorageBucket, useValue: "gs://sunday-5fc9e.appspot.com/"}],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { DataApiService } from "../services/data-api.service";
import { UserInterface } from "../models/user";
import { snapshotChanges } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import {SelectItem, SelectItemGroup} from 'primeng/primeng'
import { Router } from '@angular/router';


@Component({
  selector: "app-tareas",
  templateUrl: "./tareas.component.html",
  styleUrls: ["./tareas.component.scss"]
})
export class TareasComponent implements OnInit {
  ngOnInit() {
    this.authService.isAuth().subscribe(user => {
      if (user) {
        this.user.name = user.displayName;
        this.user.email = user.email;
        this.user.photoUrl = user.photoURL;
        this.providerId = user.providerData[0].providerId;
      }
    });
    this.dataApi.getAllUsers().subscribe(users => {
      console.log("users", users);
      this.users = users;
    });
  }
  value: Date;
  prioridad: SelectItem[];
  proyecto: SelectItem[];
  miembro: SelectItem[];
  constructor(private authService: AuthService,private dataApi: DataApiService, private afs: AngularFirestore,private router: Router,) {
    this.prioridad = [
      { label: "Nula", value: "Null" },
      { label: "Baja", value: "Low" },
      { label: "Media", value: "Medium" },
      { label: "Alta", value: "High" },
      { label: "Muy Alta", value: "Very High" }
    ];
    this.proyecto = [
      { label: "Nula", value: "Null" },
      { label: "Baja", value: "Low" },
      { label: "Media", value: "Medium" },
      { label: "Alta", value: "High" },
      { label: "Muy Alta", value: "Very High" }
    ];
    this.miembro = [
      { label: "Nula", value: "Null" },
      { label: "Baja", value: "Low" },
      { label: "Media", value: "Medium" },
      { label: "Alta", value: "High" },
      { label: "Muy Alta", value: "Very High" }
    ]
  }

  user: UserInterface = {
    name: "",
    email: "",
    photoUrl: ""
  };

  private users: UserInterface[];
  public providerId: string = "null";

  onLogout() {
    this.authService.logoutUser(); 
    this.onLoginRedirect();
  }
  onLoginRedirect(): void {
    this.router.navigate(['/login']);
  }
}

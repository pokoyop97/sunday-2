import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { DataApiService } from "../services/data-api.service";
import { UserInterface } from "../models/user";
import { SelectItem } from "primeng/primeng";
import { Router } from "@angular/router";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { AngularFireAuth } from "@angular/fire/auth";
import { ProjectInterface } from "../models/projects";
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/operators";

@Component({
  selector: "app-miembros",
  templateUrl: "./miembros.component.html",
  styleUrls: ["./miembros.component.scss"]
})
export class MiembrosComponent implements OnInit {
  private projects: ProjectInterface[];

  private ProjectCollection: AngularFirestoreCollection<ProjectInterface>;
  private projectos: Observable<ProjectInterface[]>;

  private datosProyecto: ProjectInterface;

  @Input() proyectos = new Array();
  constructor(
    private authService: AuthService,
    private dataApi: DataApiService,
    private router: Router,
    private storage: AngularFireStorage,
    private afsAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
  }
  user: UserInterface = {
    name: "",
    email: "",
    photoUrl: ""
  };

  private users: UserInterface[];

  private itemsCollection: AngularFirestoreCollection;
  
  ngOnInit() {
    this.authService.isAuth().subscribe(user => {
      if (user) {
        this.user.name = user.displayName;
        this.user.email = user.email;
        this.user.photoUrl = user.photoURL;
      }
      this.dataApi.getAllProjects(this.user.email).subscribe(projects => {
        this.projects = projects;
      });
      this.dataApi.getAllUsers().subscribe(users => {
        this.users = users;
      });
      this.afs.doc(`projects/${this.user.email}`).collection(`/creados/`).snapshotChanges().pipe(map(actions=> actions.map(a=>{ const data = a.payload.doc.data(); const id = a.payload.doc.id; return {id, data};}))).subscribe(data=>{
        data.forEach((dato:any)=>{
          this.itemsCollection = this.afs.doc(`projects/${this.user.email}`).collection(`/creados`);
          this.itemsCollection.valueChanges().subscribe((data:any)=>{
            data.forEach(dato2=>{
              this.datosProyecto ={
                Project_id: dato.id,
                name: dato.data.name,
                description: dato.data.descripcion
              };})
              this.proyectos.push({
                name: dato.data.name,
                descripcion: dato.data.descripcion,
                Project_id: dato.id,})})})})});
            }

  onLogout() {
    this.authService.logoutUser();
    this.onLoginRedirect();
  }
  onLoginRedirect(): void {
    this.router.navigate(["/login"]);
  }
}

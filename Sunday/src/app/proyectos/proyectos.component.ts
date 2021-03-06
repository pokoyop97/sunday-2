import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { DataApiService } from "../services/data-api.service";
import { UserInterface } from "../models/user";
import { RolesInterface } from "../models/roles"
import { ProjectInterface } from "../models/projects";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs/internal/Observable";
import { AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";

import { map } from "rxjs/operators";

@Component({
  selector: "app-proyectos",
  templateUrl: "./proyectos.component.html",
  styleUrls: ["./proyectos.component.scss"]
})
export class ProyectosComponent implements OnInit {
  @ViewChild('imageUser',{static: false}) inputImageUser: ElementRef;
  private itemsCollection: AngularFirestoreCollection<any>;
  downloadURL: Observable<string>;
  uploadPercent: Observable<number>;
  
  public email: string= "";
  public idpro: string= "";
  private rols: RolesInterface[];

  public newCurrent: any;

  public titulo: string = "";
  public descripcion: string = "";
  private users: UserInterface[];
  private projects: ProjectInterface[];
  private projectsU: ProjectInterface[];
  public providerId: string = "null";
  public fileref: string;


  private ProjectCollection: AngularFirestoreCollection<ProjectInterface>;
  private projectos: Observable<ProjectInterface[]>;
  private userDoc: AngularFirestoreDocument<UserInterface>;

  constructor(
    private authService: AuthService,
    private dataApi: DataApiService,
    private router: Router,
    private storage: AngularFireStorage,
    private afsAuth: AngularFireAuth,
    private afs: AngularFirestore,
  ) {
    this.ProjectCollection = afs.collection<ProjectInterface>("projects");
    this.projectos = this.ProjectCollection.valueChanges();
  }

  user: UserInterface = {
    name: "",
    email: "",
    photoUrl: "",
    User_id: ""
  };

  /* --------------------------------------------------------------------------------------------------------------------------------- */
  ngOnInit() {
    this.authService.isAuth().subscribe(user => {
      if (user) {
        this.user.name = user.displayName;
        this.user.email = user.email;
        this.user.photoUrl = user.photoURL;
        this.user.User_id = user.uid;
/*         this.dataApi.getAllUsers().subscribe(users => {
          this.users = users;
        }); */
        this.dataApi.getAllProjects(this.user.email).subscribe(projects => {
          this.projects = projects;
        });
        this.dataApi.getAllProjectsUnidos(this.user.email).subscribe(projects => {
          this.projectsU = projects;
        });
      }
        
    });
  }
  /* --------------------------------------------------------------------------------------------------------------------------------- */
  ViewProyecto(value: string, email: string){
    let newCurrent ={
      current: value,
      correo: email,
    }
    this.afs.collection('current').doc('proyecto').set(newCurrent)
  }

  ViewProyectoUnido(value: string){
    let newCurrent ={
      current: value
    }
    this.afs.collection('currentUnido').doc('proyecto').set(newCurrent)
  }

  onAddProject() {

    if(this.titulo == ""){
      alert("Ingrese un titulo para el proyecto")
      if(this.descripcion == ""){
        alert("Ingrese una descripcion para el proyecto")
        if(this.downloadURL == undefined){
          alert("Agregue una imagen")
        }else{
          this.onAddProjectDoc();
          this.onAddProjectName();
        }
      } 
    }else if(this.descripcion == ""){
      alert("Ingrese una descripcion para el proyecto")
      if(this.downloadURL == undefined){
        alert("Agregue una imagen")
      }else{
        this.onAddProjectDoc();
        this.onAddProjectName();
      }
    }else{
      if(this.downloadURL == undefined){
        alert("Agregue una imagen")
      }else{
        this.onAddProjectDoc();
        this.onAddProjectName();
      }
    }
  }
  onAddProjectDoc() {
    const projectRef: AngularFirestoreDocument<any> = this.afs.doc(
      `projects/${this.user.email}`
    );
    const data: ProjectInterface = {};
    return projectRef.set(data, { merge: false });
  }

  onAddProjectName() {
    let newProject = {
      User_id: this.user.User_id,
      name: this.titulo,
      descripcion: this.descripcion,
      img: this.downloadURL,
      fileref: this.fileref,
      email: this.user.email,
    };
    this.afs
      .doc(`projects/${this.user.email}`)
      .collection(`/creados`)
      .add(newProject);
  }
  onUpload(e) {
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `projects/${this.user.email}/creados/${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => {ref.getDownloadURL().subscribe(url => {this.downloadURL = url;this.fileref = filePath;});})).subscribe();
  }
  onDeleteProject(docID: string, image: string) {
    const storageRef = this.storage.storage.ref();
    storageRef
      .child(image)
      .delete()
      .then(() => {
      })
      .catch(err => {
        console.log(err);
      });
    this.afs
      .doc(`projects/${this.user.email}`)
      .collection(`/creados`)
      .doc(docID)
      .delete()
      .then(() => {
        alert("se elimino el proyecto");
      })
      .catch(err => {
        console.log(err);
      });
  }
  onLogout() {
    this.authService.logoutUser();
    this.onLoginRedirect();
  }
  onLoginRedirect(): void {
    this.router.navigate(["/login"]);
  }
}

/*   onGetName(){
    this.ProjectCollection = this.afs.collection<ProjectInterface>('projects/zxdddf@gmail.com/creados');
    return this.projectos = this.ProjectCollection.snapshotChanges()
    .pipe(map(changes=>{
      return changes.map( action=>{
      const data = action.payload.doc.data() as ProjectInterface;
      data.Project_id = action.payload.doc.id;
      return data;
    });
  }));
  } 
  
  
  
  (click)="onDeleteProject(Project_id,fileRef)"
  */

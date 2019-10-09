import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { DataApiService } from "../services/data-api.service";
import { UserInterface } from "../models/user";
import { Router, ActivatedRoute } from "@angular/router";
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
import { RolesInterface } from '../models/roles';

@Component({
  selector: "app-miembros",
  templateUrl: "./miembros.component.html",
  styleUrls: ["./miembros.component.scss"]
})
export class MiembrosComponent implements OnInit {
  public copy: string= "";

  public roles: string = "";
  public valorProyecto: string = "";
  public valorProyectoPersonal: string = "";
  private projects: ProjectInterface[];
  private rols: RolesInterface[];

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
    private afs: AngularFirestore,
    private activatedRoute: ActivatedRoute,
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
      
      this.afs.doc(`projects/${this.user.email}`).collection(`/creados/`).snapshotChanges()
      .pipe(map(actions=> actions.map(a=>{ 
        const data = a.payload.doc.data(); 
        const id = a.payload.doc.id; 
        return {id, data};})))
        .subscribe(data=>{
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
                Project_id: dato.id,})})})});
              });
}

  cambiarTipoProyectoPersonal(value: any) {
    this.valorProyectoPersonal = value;
    
  } 

  cambiarTipoProyecto(value: any) {
    this.valorProyecto = value;
    this.dataApi.getAllRoles(this.valorProyecto).subscribe(roles => {
      this.rols = roles;
  });
} 
  onAddRol(){
    if(this.roles==""){
      alert("Agregue el nombre del rol")
    }else{
    const generar = Math.random().toString(36).substring(2);
    let newRol = {
      User_id : "",
      nombre: "",
      rol: this.roles,
      link:`${this.valorProyectoPersonal}/${generar}/${this.user.email}` ,
      pertenece: this.user.email
    };
    this.afs.doc(`roles/${this.valorProyectoPersonal}`).collection(`rol`).doc(`${generar}`).set(newRol);

    this.afs.doc(`projects/${this.user.email}`).collection(`/creados/`).snapshotChanges()
      .pipe(map(actions=> actions.map(a=>{ 
        const data = a.payload.doc.data(); 
        const id = a.payload.doc.id; 
        return {id, data};})))
        .subscribe(data=>{
        data.forEach((dato:any)=>{
          this.itemsCollection = this.afs.doc(`projects/${this.user.email}`).collection(`/creados`);
          this.itemsCollection.valueChanges().subscribe((data:any)=>{
            data.forEach(dato2=>{
              this.datosProyecto ={
                Project_id: dato.id,
                name: dato.data.name,
                description: dato.data.descripcion,
                img: dato.data.img
              };})
              if(dato.id == this.valorProyectoPersonal){
                console.log(this.valorProyectoPersonal)
                console.log(dato.id)
                let unirse = {
                  name: dato.data.name,
                  descripcion: dato.data.descripcion,
                  Project_id: this.valorProyectoPersonal,
                  img: dato.data.img
                }                
                 this.afs.doc(`unido/${this.user.email}`).collection(this.valorProyectoPersonal).doc(generar).set(unirse); 
              }})})});
    
            }
  }

  copyToClipboard() {
    this.copy = document.getElementById('link').innerHTML; 
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.copy;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  onLogout() {
    this.authService.logoutUser();
    this.onLoginRedirect();
  }
  onLoginRedirect(): void {
    this.router.navigate(["/login"]);
  }
}


/* 
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
          Project_id: dato.id,})})})})}); */
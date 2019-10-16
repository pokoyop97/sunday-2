import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserInterface} from '../models/user'
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { DataApiService } from '../services/data-api.service';
import { RolesInterface } from '../models/roles'
import { ProjectInterface } from '../models/projects'

import { map } from "rxjs/operators";

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {
private projectsU: ProjectInterface[];

public idrol: string= "";

private rols: RolesInterface[];
private datosProyecto: ProjectInterface;


private itemsCollection: AngularFirestoreCollection<any>;

constructor( private router: Router, private authService: AuthService, private activatedRoute: ActivatedRoute,private afs: AngularFirestore, private dataApi: DataApiService) { }

/*   ------------------------------------------------------------------------------------------------------------------------------------------ */
user: UserInterface = {
  name: '',
  email: '',
  photoUrl: '',
};

/*   ------------------------------------------------------------------------------------------------------------------------------------------ */
  ngOnInit() {
    this.authService.isAuth().subscribe(user => {
      if (user) {
        this.user.name = user.displayName;
        this.user.email = user.email;
        this.user.photoUrl = user.photoURL;
        this.user.User_id = user.uid;
      }
      this.dataApi.getAllProjectsPendientes(this.user.email).subscribe(projects => {
        this.projectsU = projects;
      });
    })
  }
/*   ------------------------------------------------------------------------------------------------------------------------------------------ */
unirse(idpro: string, rouls: string){
  this.authService.isAuth().subscribe(user => {
    if (user) {
      this.user.name = user.displayName;
      this.user.email = user.email;
      this.user.photoUrl = user.photoURL;
      this.user.User_id = user.uid;
    }
    this.dataApi.getAllRoles(idpro).subscribe(roles => {
      this.rols = roles;
  });
  this.afs.doc(`pendientes/${this.user.email}/`).collection("rol").snapshotChanges()
    .pipe(map(actions=> actions.map(a=>{ 
      const data = a.payload.doc.data(); 
      const id = a.payload.doc.id; 
      return {id, data};})))
      .subscribe(data=>{
      data.forEach((dato:any)=>{
        this.itemsCollection = this.afs.doc(`pendientes/${this.user.email}`).collection("rol");
        this.itemsCollection.valueChanges().subscribe((data:any)=>{
          data.forEach(dato2=>{
            this.datosProyecto ={
              Project_id: dato.id,
              name: dato.data.name,
              description: dato.data.descripcion,
              img: dato.data.img
            };})
             if(dato.id == idpro){
              let unirse = {
                name: dato.data.name,
                descripcion: dato.data.descripcion,
                Project_id: idpro,
                img: dato.data.img
              }   
              let dataz = {
                User_id: this.user.User_id,
                nombre: this.user.name,
              }     
               this.afs.doc(`unido/${this.user.email}`).collection("rol").doc(idpro).set(unirse); 
               this.afs.doc(`pendientes/${this.user.email}`).collection("rol").doc(idpro).delete()
               
              this.itemsCollection =  this.afs.collection<any>('roles').doc(idpro).collection('rol')
              
              this.itemsCollection.doc(rouls).update(dataz).then(data=>{
                alert("Se acepto pertenecer a este proyecto")
                this.router.navigate(['/solicitudes'])
              }).catch(err=>console.log(err));        
            }
          })})});
  })
}


rechazar(idpro: string, rouls: string){
  this.authService.isAuth().subscribe(user => {
    if (user) {
      this.user.name = user.displayName;
      this.user.email = user.email;
      this.user.photoUrl = user.photoURL;
      this.user.User_id = user.uid;
    }
    this.dataApi.getAllRoles(idpro).subscribe(roles => {
      this.rols = roles;
  });
  this.afs.doc(`pendientes/${this.user.email}/`).collection("rol").snapshotChanges()
    .pipe(map(actions=> actions.map(a=>{ 
      const data = a.payload.doc.data(); 
      const id = a.payload.doc.id; 
      return {id, data};})))
      .subscribe(data=>{
      data.forEach((dato:any)=>{
        this.itemsCollection = this.afs.doc(`pendientes/${this.user.email}`).collection("rol");
        this.itemsCollection.valueChanges().subscribe((data:any)=>{
          data.forEach(dato2=>{
            this.datosProyecto ={
              Project_id: dato.id,
              name: dato.data.name,
              description: dato.data.descripcion,
              img: dato.data.img
            };})
             if(dato.id == idpro){
              let unirse = {
                name: dato.data.name,
                descripcion: dato.data.descripcion,
                Project_id: idpro,
                img: dato.data.img
              }   
              let dataz = {
                User_id: this.user.User_id,
                nombre: this.user.name,
              }     
               this.afs.doc(`rechazado/${this.user.email}`).collection("rol").doc(idpro).set(unirse); 
               this.afs.doc(`pendientes/${this.user.email}`).collection("rol").doc(idpro).delete().then(data=>{
                alert("Se rechazo pertenecer a este proyecto")
                this.router.navigate(['/solicitudes'])
              }).catch(err=>console.log(err));        
            }
          })})});
  })
}


onLogout() {
  this.authService.logoutUser();
  this.onLoginRedirect();
}
onLoginRedirect(): void {
  this.router.navigate(["/login"]);
}
  
}

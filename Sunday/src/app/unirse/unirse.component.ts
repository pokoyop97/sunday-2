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
  selector: 'app-unirse',
  templateUrl: './unirse.component.html',
  styleUrls: ['./unirse.component.scss']
})
export class UnirseComponent implements OnInit {
  public idpro: string= "";
  public idrol: string= "";
  public email: string= "";
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
    this.idpro = this.activatedRoute.snapshot.paramMap.get("idProyecto");
    this.idrol = this.activatedRoute.snapshot.paramMap.get("idRol");
    this.email = this.activatedRoute.snapshot.paramMap.get("email");
    this.authService.isAuth().subscribe(user => {
      if (user) {
        this.user.name = user.displayName;
        this.user.email = user.email;
        this.user.photoUrl = user.photoURL;
        this.user.User_id = user.uid;
      }
      this.dataApi.getAllRoles(this.idpro).subscribe(roles => {
        this.rols = roles;
    });
    this.afs.doc(`unido/${this.email}`).collection(this.idpro).snapshotChanges()
      .pipe(map(actions=> actions.map(a=>{ 
        const data = a.payload.doc.data(); 
        const id = a.payload.doc.id; 
        return {id, data};})))
        .subscribe(data=>{
        data.forEach((dato:any)=>{
          this.itemsCollection = this.afs.doc(`unido/${this.email}`).collection(this.idpro);
          this.itemsCollection.valueChanges().subscribe((data:any)=>{
            data.forEach(dato2=>{
              this.datosProyecto ={
                Project_id: dato.id,
                name: dato.data.name,
                description: dato.data.descripcion,
                img: dato.data.img
              };})
              if(dato.id == this.idrol){
                console.log(this.idpro)
                console.log(this.idrol)
                let unirse = {
                  name: dato.data.name,
                  descripcion: dato.data.descripcion,
                  Project_id: this.idpro,
                  img: dato.data.img
                }                
                 this.afs.doc(`unido/${this.user.email}`).collection("rol").doc(this.idpro).set(unirse); 
                 this.afs.doc(`unido/${this.email}`).collection(this.idpro).doc(this.idrol).delete()
              }})})});
       let data = {
        User_id: this.user.User_id,
        nombre: this.user.name,
  
      }
      this.itemsCollection =  this.afs.collection<any>('roles').doc(this.idpro).collection('rol')
      
      this.itemsCollection.doc(this.idrol).update(data).then(data=>{this.router.navigate(['/refi'])
      }).catch(err=>console.log(err));
       
    })
    
  }
/*   ------------------------------------------------------------------------------------------------------------------------------------------ */


onLogout() {
  this.authService.logoutUser();
  this.onLoginRedirect();
}
onLoginRedirect(): void {
  this.router.navigate(["/login"]);
}

}

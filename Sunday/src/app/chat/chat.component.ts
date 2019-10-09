import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { ChatService } from '../services/chat.service';
import { UserInterface } from "../models/user";
import { TasksInterface } from "../models/tasks";
import { SelectItem } from "primeng/primeng";
import { Router } from "@angular/router";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { ProjectInterface } from "../models/projects";
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/operators";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"]
})
export class ChatComponent implements OnInit {
  
  public valorProyecto: string = "";
  mensaje = "";

  public project_id: string = "";
  public user_id: string = "";
  public name: string = "";
  public descripcion: string = "";
  @Input() proyectos = new Array();
  private itemsCollection: AngularFirestoreCollection;
  private datosProyecto: ProjectInterface;

  user: UserInterface = {
    name: "",
    email: "",
    photoUrl: ""
  };
  /* -------------------------------------------------------------------------------------------------------------------------------------------------------*/
  constructor(
    private authService: AuthService,
    private router: Router,
    private afs: AngularFirestore,
    private chatservice: ChatService
  ) {

  }
  /* ---------------------------------------------------------------------------------------------------------------- */
  ngOnInit() {
    this.authService.isAuth().subscribe(user => {
      if (user) {
        this.user.name = user.displayName;
        this.user.email = user.email;
        this.user.photoUrl = user.photoURL;
      }
      this.afs
    .doc(`unido/${this.user.email}`)
    .collection(`/rol`)
    .snapshotChanges()
    .pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        })
      )
    )
    .subscribe(data => {
      data.forEach((dato: any) => {
        this.itemsCollection = this.afs
          .doc(`unido/${this.user.email}`)
          .collection(`/rol`);
        this.itemsCollection.valueChanges().subscribe((data: any) => {
          data.forEach(dato2 => {
            this.datosProyecto = {
              Project_id: dato.id,
              name: dato.data.name,
              description: dato.data.descripcion
            };
          });
          console.log(dato.id)
          this.proyectos.push({
            name: dato.data.name,
            descripcion: dato.data.descripcion,
            Project_id: dato.id
          });
        });
      });
    });
/* -------------------------Proyectos que creo------------------------------------------------------------ */
    this.afs
    .doc(`projects/${this.user.email}`)
    .collection(`/creados/`)
    .snapshotChanges()
    .pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        })
      )
    )
    .subscribe(data => {
      data.forEach((dato: any) => {
        this.itemsCollection = this.afs
          .doc(`projects/${this.user.email}`)
          .collection(`/creados`);
        this.itemsCollection.valueChanges().subscribe((data: any) => {
          data.forEach(dato2 => {
            this.datosProyecto = {
              Project_id: dato.id,
              name: dato.data.name,
              description: dato.data.descripcion
            };
          });
          this.proyectos.push({
            name: dato.data.name,
            descripcion: dato.data.descripcion,
            Project_id: dato.id
          });

        });
      });
    });
    }); 
    
  }

  cambiarTipoProyecto(value: any) {
    this.valorProyecto = value;
    this.chatservice.cargarMensajes(this.user.email,value).subscribe((mensajes:any[])=>{{        this.chatservice.chats = [];
      for(let mensaje of mensajes){
        this.chatservice.chats.unshift(mensaje);
      }
    }});
  }

  enviarMensaje(){
    if(this.mensaje == ""){
      return; 
    }else{
      this.chatservice.agregarMensaje
      (this.mensaje, this.user.email, this.user.name, this.user.name,this.valorProyecto).then(()=>{
        this.mensaje ="";
      })
      .catch(err=>{
        alert(err);
      })
    }

} 
  onLogout() {
    this.authService.logoutUser();
    this.onLoginRedirect();
  }
  onLoginRedirect(): void {
    this.router.navigate(["/login"]);
  }
}

import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { DataApiService } from "../services/data-api.service";
import { UserInterface } from "../models/user";
import { TasksInterface } from "../models/tasks";
import { SelectItem } from "primeng/primeng";
import { Router } from "@angular/router";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { AngularFireAuth } from "@angular/fire/auth";
import { ProjectInterface } from "../models/projects";
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/operators";
@Component({
  selector: "app-tareas",
  templateUrl: "./tareas.component.html",
  styleUrls: ["./tareas.component.scss"]
})
export class TareasComponent implements OnInit {
  public valorProyecto: string = "";
  public valorMiembro: string = "";
  public valorPrioridad: string = "";

  public project_id: string = "";
  public user_id: string = "";
  public name: string = "";
  public descripcion: string = "";

  private ProjectCollection: AngularFirestoreCollection<ProjectInterface>;
  private projectos: Observable<ProjectInterface[]>;

  @Input() proyectos = new Array();
  private itemsCollection: AngularFirestoreCollection;
  private projects: ProjectInterface[];
  private datosProyecto: ProjectInterface;

  user: UserInterface = {
    name: "",
    email: "",
    photoUrl: "",
    User_id: ""
  };
  private tasks: TasksInterface[];
  private users: UserInterface[];
  date1: Date;
  prioridad: string[];
  proyecto: SelectItem[];
  miembro: SelectItem[];
  /* -------------------------------------------------------------------------------------------------------------------------------------------------------*/
  constructor(
    private authService: AuthService,
    private dataApi: DataApiService,
    private router: Router,
    private storage: AngularFireStorage,
    private afsAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.ProjectCollection = afs.collection<ProjectInterface>("projects");
    this.projectos = this.ProjectCollection.valueChanges();

    this.prioridad = ["Nula", "Baja", "Media", "Alta", "Muy Alta"];

    this.miembro = [];

    this.date1 = new Date();
  }
  /* ---------------------------------------------------------------------------------------------------------------- */
  ngOnInit() {
    this.authService.isAuth().subscribe(user => {
      if (user) {
        this.user.name = user.displayName;
        this.user.email = user.email;
        this.user.photoUrl = user.photoURL;
        this.user.User_id = user.uid;
      }
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
    this.dataApi.getAllRoles(value).subscribe(users => {
      this.users = users;
    });
  }
  cambiarTipoMiembro(value: any) {
    this.valorMiembro = value;
  }
  cambiarTipoPrioridad(value: any) {
    this.valorPrioridad = value;
  }
  cambiarTipoProyectoPersonal(value: any) {
    this.valorProyecto = value;
    this.dataApi.getAllTasksByUser(this.valorProyecto,this.user.User_id).subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  onAddTask() {
    if(this.name==""){
      alert("Ingrese el nombre de la tarea")
      if(this.descripcion==""){
        alert("Ingrese la descripcion de la tarea")
          }else{
              this.procedimiento()
              alert("Se agrego la tarea con exito")
            }
          }else{
            this.procedimiento()
            alert("Se agrego la tarea con exito")
          }
        }

  procedimiento(){
    const id = Math.random().toString(36).substring(2);
    let newTask = {
      tarea_id: id,
      Project_id: this.valorProyecto,
      User_id: this.valorMiembro,
      prioridad: this.valorPrioridad,
      name: this.name,
      description: this.descripcion,
      fecha: this.date1.toISOString()
    };
    this.afs.doc(`tareas/${this.valorProyecto}`).collection(`tareas`).doc(`${this.valorMiembro}`).collection(`${this.valorMiembro}`).doc(id).set(newTask);
    this.afs.doc(`tareas/${this.valorProyecto}`).collection(`works`).doc(id).set(newTask)
  }

  onDeleteTask(taskID: string, proyectoID: string, userID: string) {
    alert(proyectoID+`,`+ taskID+`,`+ userID)
    this.afs.doc(`tasks/${proyectoID}`).collection(`tareas/${userID}/${userID}`).doc(taskID).delete()
      .then(() => {
        alert("se elimino la tarea");
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

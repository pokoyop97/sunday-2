import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { DataApiService } from "../services/data-api.service";
import { UserInterface } from "../models/user";
import { TasksInterface } from "../models/tasks";
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
    photoUrl: ""
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
      }
      this.dataApi.getAllUsers().subscribe(users => {
        this.users = users;
      });

      this.dataApi.getAllTasks(user.uid).subscribe(tasks => {
        console.log(tasks);
        this.tasks = tasks;
      });

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
              /* console.log(dato.id);
              console.log(dato.data.name);
              console.log(dato.data.descripcion); */
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
  }
  cambiarTipoMiembro(value: any) {
    this.valorMiembro = value;
  }
  cambiarTipoPrioridad(value: any) {
    this.valorPrioridad = value;
  }

  onAddTask() {
    let newTask = {
      Project_id: this.valorProyecto,
      User_id: this.valorMiembro,
      prioridad: this.valorPrioridad,
      name: this.name,
      description: this.descripcion,
      fecha: this.date1.toISOString()
    };
    console.log(this.project_id);
    this.afs
      .doc(`tasksPerProject/${this.user.email}`)
      .collection(`tareas/${this.project_id}`)
      .add(newTask);

    let newTask2 = {
      Project_id: this.valorProyecto,
      User_id: this.valorMiembro,
      prioridad: this.valorPrioridad,
      name: this.name,
      description: this.descripcion,
      fecha: this.date1.toISOString()
    };
    this.afs
      .doc(`tasksPerPerson/${this.valorMiembro}`)
      .collection(`tareas/${this.project_id}`)
      .add(newTask2);
  }

  onDeleteTask(taskID: string) {
    this.afs
      .doc(`tasks/${this.user.email}`)
      .collection(`tareas/${this.project_id}`)
      .doc(taskID)
      .delete()
      .then(() => {
        console.log("se elimino la tarea");
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

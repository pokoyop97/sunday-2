import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { DataApiService } from "../services/data-api.service";
import { UserInterface } from "../models/user";
import { ProjectInterface } from "../models/projects";
import { TasksInterface } from "../models/tasks";
import { CurrentInterface } from '../models/current';
import { RolesInterface } from '../models/roles'
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs/internal/Observable";
import { AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";

@Component({
  selector: 'app-proyectos-crear-unido',
  templateUrl: './proyectos-crear-unido.component.html',
  styleUrls: ['./proyectos-crear-unido.component.scss']
})
export class ProyectosCrearUnidoComponent implements OnInit {
  public asdf :string;
  public asdfg :string;

  private rols: RolesInterface[];
  private tasks: TasksInterface[];
  private rolsU: RolesInterface[];
  private tasksU: TasksInterface[];
  
  private tasksBU: TasksInterface[];
  public titulo: string = "";
  public descripcion: string = "";
  private users: UserInterface[];
  private projects: ProjectInterface[];
  public providerId: string = "null";
  public fileref: string;

  currentInfo = new Array();
  currentInfoU = new Array();

  downloadURL: Observable<string>;
  uploadPercent: Observable<number>;

  private ProjectCollection: AngularFirestoreCollection<ProjectInterface>;
  private projectos: Observable<ProjectInterface[]>;
  private userDoc: AngularFirestoreDocument<UserInterface>;

  private currentU: AngularFirestoreDocument<CurrentInterface>;

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

        this.currentU = this.afs.doc<CurrentInterface>('currentUnido/proyecto');
        this.currentU.get().subscribe(doc=>{
          this.currentInfoU.push(doc.data())
          this.dataApi.getAllTasksByUser(this.currentInfoU[0].current, user.uid).subscribe(tasks => {
            this.tasksBU = tasks;
          });
          this.dataApi.getAllTasks(this.currentInfoU[0].current).subscribe(tasks => {
            this.tasksU = tasks;
          });
          this.dataApi.getAllRoles(this.currentInfoU[0].current).subscribe(roles => {
            this.rolsU = roles;
          })
        })
/*         this.dataApi.getAllUsers().subscribe(users => {
          this.users = users;
        }); */
        this.dataApi.getAllProjects(this.user.email).subscribe(projects => {
          this.projects = projects;
        });
        
      }
    });
  }
  /* --------------------------------------------------------------------------------------------------------------------------------- */

  onUpload(e) {
    const id = Math.random()
      .toString(36)
      .substring(2);
    const file = e.target.files[0];
    const filePath = `projects/${this.user.email}/creados/${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(url => {
            this.downloadURL = url;
            this.fileref = filePath;
          });
        })
      )
      .subscribe();
  }


  onLogout() {
    this.authService.logoutUser();
    this.onLoginRedirect();
  }
  onLoginRedirect(): void {
    this.router.navigate(["/login"]);
  }

}

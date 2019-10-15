import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserInterface } from '../models/user';
import { ProjectInterface } from '../models/projects'
import { RolesInterface } from '../models/roles'
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { TasksInterface } from '../models/tasks';
@Injectable({
  providedIn: 'root'
})
export class DataApiService {

  private itemsCollection: AngularFirestoreCollection<any>;
  constructor(private afs: AngularFirestore) { 
    this.UserCollection = afs.collection<UserInterface>('users');
    this.users = this.UserCollection.valueChanges();
    this.ProjectCollection = afs.collection<ProjectInterface>('projects');
    this.projects = this.ProjectCollection.valueChanges();
    this.RolesCollection = afs.collection<RolesInterface>('roles');
    this.roles = this.RolesCollection.valueChanges();
    this.TasksCollection = afs.collection<TasksInterface>('tasks');
    this.tasks = this.TasksCollection.valueChanges();
  }
  private ProjectCollection: AngularFirestoreCollection<ProjectInterface>;
  private UserCollection: AngularFirestoreCollection<UserInterface>;
  private RolesCollection: AngularFirestoreCollection<RolesInterface>;
  private TasksCollection: AngularFirestoreCollection<TasksInterface>;
  private tasks: Observable<TasksInterface[]>;
  private roles: Observable<RolesInterface[]>;
  private users: Observable<UserInterface[]>;
  private projects: Observable<ProjectInterface[]>;
  private userDoc: AngularFirestoreDocument<UserInterface>;
  

  public getAllUsers() {
    this.UserCollection = this.afs.collection<UserInterface>('users');
    return this.users = this.UserCollection.snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as UserInterface;
          data.User_id = action.payload.doc.id;
          return data;
        });
      }));
  } 

  public getAllProjects(email: string){
    this.ProjectCollection = this.afs.collection<ProjectInterface>(`projects/`+email+`/creados`);
    return this.projects = this.ProjectCollection.snapshotChanges()
    .pipe(map(changes=>{
      return changes.map( action=>{
      const data = action.payload.doc.data() as ProjectInterface;
      data.Project_id = action.payload.doc.id;
      return data;
    });
  }));
  }

  public getAllTasks(proyecto: string){
    this.ProjectCollection = this.afs.collection<ProjectInterface>(`tareas/`+proyecto+`/works/`);
    return this.projects = this.ProjectCollection.snapshotChanges()
    .pipe(map(changes=>{
      return changes.map( action=>{
      const data = action.payload.doc.data() as ProjectInterface;
      data.Project_id = action.payload.doc.id;
      return data;
      
    });
  }));
  }

  public getAllTasksByUser(proyecto: string,user: string){
    this.TasksCollection = this.afs.collection<TasksInterface>(`tareas/`+proyecto+`/tareas/`+user+`/`+user+`/`);
    return this.tasks = this.TasksCollection.snapshotChanges()
    .pipe(map(changes=>{
      return changes.map( action=>{
      const data = action.payload.doc.data() as TasksInterface;
      data.tarea_id = action.payload.doc.id;
      return data;
    });
  }));
  }

  public getAllRoles(proyecto: string){
    this.RolesCollection = this.afs.collection<RolesInterface>(`roles/`+proyecto+`/rol/`);
    return this.roles = this.RolesCollection.snapshotChanges()
    .pipe(map(changes=>{
      return changes.map( action=>{
      const data = action.payload.doc.data() as RolesInterface;
      data.Rol_id = action.payload.doc.id;
      return data;
    });
  }));
  }

  public getAllProjectsUnidos(email: string){
    this.ProjectCollection = this.afs.collection<ProjectInterface>(`unido/`+email+`/rol`);
    return this.projects = this.ProjectCollection.snapshotChanges()
    .pipe(map(changes=>{
      return changes.map( action=>{
      const data = action.payload.doc.data() as ProjectInterface;
      data.Project_id = action.payload.doc.id;
      return data;
    });
  }));
  }




  addUser(user: UserInterface): void {
    this.UserCollection.add(user);
  }
  updateUser(user: UserInterface): void {
    let idUser = user.User_id;
    this.userDoc = this.afs.doc<UserInterface>(`users/${idUser}`);
    this.userDoc.update(user);
  }
  deleteUser(idUser: string): void {
    this.userDoc = this.afs.doc<UserInterface>(`users/${idUser}`);
    this.userDoc.delete();
  }

  obtenerColeccionDeDocumento(nombreColeccion:string,idDocumento:string){
    this.itemsCollection = this.afs.collection<any>(`${nombreColeccion}/${idDocumento}`);
    return this.itemsCollection.snapshotChanges();
  }
}

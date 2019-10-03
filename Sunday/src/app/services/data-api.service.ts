import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserInterface } from '../models/user';
import { ProjectInterface } from '../models/projects'
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
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
  }
  private ProjectCollection: AngularFirestoreCollection<ProjectInterface>;
  private UserCollection: AngularFirestoreCollection<UserInterface>;
  private users: Observable<UserInterface[]>;
  private projects: Observable<ProjectInterface[]>
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

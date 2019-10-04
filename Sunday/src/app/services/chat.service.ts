import { Injectable, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Mensaje } from '../models/chat';


 
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public chats:Mensaje[]=[];
  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  constructor(private afs: AngularFirestore) {}

  cargarMensajes(proyectos: string,idProyecto:string){
    this.itemsCollection = this.afs.collection('projects').doc(proyectos).collection('chats').doc(idProyecto).collection('chats', ref => ref.orderBy('fecha','desc').limit(100));
    return this.itemsCollection.valueChanges();
  }


  agregarMensaje(texto:string, idProyecto:string, nombre:string,usuario:string, idProyec: string){
    this.itemsCollection = this.afs.collection('projects').doc(idProyecto).collection('chats').doc(idProyec).collection('chats');
    let mensaje:Mensaje = {
      nombre: nombre,
      usuario: usuario,
      mensaje:texto,
      fecha: new Date().getTime()
    }
    return this.itemsCollection.add(mensaje);
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserInterface} from '../models/user'
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
  selector: 'app-unirse',
  templateUrl: './unirse.component.html',
  styleUrls: ['./unirse.component.scss']
})
export class UnirseComponent implements OnInit {
  public idpro: string= "";
  public idrol: string= "";
  
  private itemsCollection: AngularFirestoreCollection<any>;

  constructor( private router: Router, private authService: AuthService, private activatedRoute: ActivatedRoute,private afs: AngularFirestore) { }

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
    this.authService.isAuth().subscribe(user => {
      if (user) {
        this.user.name = user.displayName;
        this.user.email = user.email;
        this.user.photoUrl = user.photoURL;
        this.user.User_id = user.uid;
      }
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

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private storage: AngularFireStorage) { }
  @ViewChild('imageUser',{static: false}) inputImageUser: ElementRef;

  uploadPercent: Observable<number>;
  public urlImage: Observable<string>;
  public name: string= "";
  ngOnInit() {
  }

  onUpload(e) {
    // console.log('subir', e.target.files[0]);
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `uploads/profile_${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();
  }
  onAddUser(email: string, password: string, name: string) {
    this.authService.registerUser(email, password)
      .then((res) => {
        this.authService.isAuth().subscribe(user => {
          if (user) { 
            user.updateProfile({
              displayName: name,
              photoURL: this.inputImageUser.nativeElement.value
            }).then(() => {
              this.authService.updateUserData(user)
              this.router.navigate(['/refi']);
            }).catch((error) => console.log('error', error));
          }
        });
      }).catch(err => console.log('err', err.message));
  }
  onLoginRedirect(): void {
    this.router.navigate(['/refi']);
  }

}

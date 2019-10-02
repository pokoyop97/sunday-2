import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private afAuth: AngularFireAuth, private router: Router, private authService: AuthService) { }
  ngOnInit() {
  }

  onLogin(email: string, password: string): void {
    this.authService.loginEmailUser(email, password)
      .then((res) => {
        this.onLoginRedirect();
      }).catch(err => console.log('err', err.message));
  }

  onLoginGoogle(): void {
    this.authService.loginGoogleUser()
      .then((res) => {
        this.onLoginRedirect();
      }).catch(err => console.log('err', err.message));
  }
  onLoginFacebook(): void {
    this.authService.loginFacebookUser()
      .then((res) => {
        this.onLoginRedirect();
      }).catch(err => console.log('err', err.message));
  }

  onLogout() {
    this.authService.logoutUser();
  }
  onLoginRedirect(): void {
    this.router.navigate(['/refi']);
  }

  register():void{
    this.router.navigate(['/register']);
  }
}

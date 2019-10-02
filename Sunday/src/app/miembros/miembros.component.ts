import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DataApiService } from '../services/data-api.service';
import { UserInterface } from '../models/user';
import {SelectItem, SelectItemGroup} from 'primeng/primeng'
import { Router } from '@angular/router';

@Component({
  selector: 'app-miembros',
  templateUrl: './miembros.component.html',
  styleUrls: ['./miembros.component.scss']
})
export class MiembrosComponent implements OnInit {
  cars: SelectItem[];
  constructor(private authService: AuthService, private dataApi: DataApiService,private router: Router) { 
    this.cars = [
      {label: 'Audi', value: 'Audi'},
      {label: 'BMW', value: 'BMW'},
      {label: 'Fiat', value: 'Fiat'},
      {label: 'Ford', value: 'Ford'},
      {label: 'Honda', value: 'Honda'},
      {label: 'Jaguar', value: 'Jaguar'},
      {label: 'Mercedes', value: 'Mercedes'},
      {label: 'Renault', value: 'Renault'},
      {label: 'VW', value: 'VW'},
      {label: 'Volvo', value: 'Volvo'}
  ];
  }
  user: UserInterface = {
    name: '',
    email: '',
    photoUrl: '',
  };

  private users: UserInterface[];
  public providerId: string = 'null';

  

  ngOnInit() {
    this.authService.isAuth().subscribe(user => {
      if (user) {
        this.user.name = user.displayName;
        this.user.email = user.email;
        this.user.photoUrl = user.photoURL;
        this.providerId = user.providerData[0].providerId;
      }
    })  
    
    this.dataApi.getAllUsers().subscribe(users => {
      console.log("users", users);
      this.users = users;
    });
  }


  onLogout() {
    this.authService.logoutUser(); 
    this.onLoginRedirect();
  }
  onLoginRedirect(): void {
    this.router.navigate(['/login']);
  }
}

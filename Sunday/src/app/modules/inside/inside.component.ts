import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserInterface} from '../../models/user'
import { Router } from '@angular/router';


@Component({
  selector: 'app-inside',
  templateUrl: './inside.component.html',
  styleUrls: ['./inside.component.scss']
})
export class InsideComponent implements OnInit {
  constructor( private router: Router, private authService: AuthService) { }

/*   ------------------------------------------------------------------------------------------------------------------------------------------ */
  user: UserInterface = {
    name: '',
    email: '',
    photoUrl: '',
  };

  /*   ------------------------------------------------------------------------------------------------------------------------------------------ */
  ngOnInit() {
    this.authService.isAuth().subscribe(user => {
      if (user) {
        this.user.name = user.displayName;
        this.user.email = user.email;
        this.user.photoUrl = user.photoURL;
        this.user.User_id = user.uid;
      }
    })
  }
/*   ------------------------------------------------------------------------------------------------------------------------------------------ */

  onLogout() {
    this.authService.logoutUser(); 
  }
  
}

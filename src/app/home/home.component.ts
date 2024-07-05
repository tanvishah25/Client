import { Component, OnInit } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { UserService } from '../_services/user.service';
import { AppUser } from '../_models/appuser';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [RegisterComponent]
})
export class HomeComponent implements OnInit {
registerMode:boolean=false;
users:AppUser[];
constructor(private userService:UserService){}

ngOnInit(): void {
  this.GetUsersDetails();
}

registerToggle(){
  this.registerMode = !this.registerMode;
}

GetUsersDetails(){
  this.userService.GetUsersDetails().subscribe({
    next : result => this.users = result,
    error: err => console.error('Observable emitted an error: ' + err),
    complete: () => console.log('Observable emitted the complete notification')
  })
}

cancelRegisterMode(event:boolean){
 this.registerMode = event;
}
}

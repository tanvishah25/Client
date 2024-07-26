import { Component } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { AppUser } from '../_models/appuser';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [RegisterComponent]
})
export class HomeComponent{
registerMode:boolean=false;
users:AppUser[];
constructor(){}


registerToggle(){
  this.registerMode = !this.registerMode;
}

cancelRegisterMode(event:boolean){
 this.registerMode = event;
}
}

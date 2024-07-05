import { Component, OnInit , inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './_services/user.service';
import { AppUser } from './_models/appuser';
import { NavComponent } from "./nav/nav.component";
import { AccountService } from './_services/account.service';
import { HomeComponent } from './home/home.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, NavComponent,HomeComponent]
})
export class AppComponent implements OnInit{
private accountService = inject(AccountService);
  constructor(private userService:UserService){}

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(){
    const userString = localStorage.getItem('user');
    if (!userString) return;
    this.accountService.currentUser.set(JSON.parse(userString));
  }
}

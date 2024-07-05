import { HttpClient } from '@angular/common/http';
import { Injectable,inject, signal } from '@angular/core';
import { AppUser } from '../_models/appuser';
import { User } from '../_models/user';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private http = inject(HttpClient);
  baseurl = 'https://localhost:44391/api/';
  currentUser = signal<User|null>(null); // we can do this with observable as well

  constructor() { }

  login(userDetails:AppUser){
    return this.http.post<User>(this.baseurl + 'account/login',userDetails).pipe(
      map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.set(user);
      })
    );
  }

  
  register(userDetails:AppUser){
    return this.http.post<User>(this.baseurl + 'account/register',userDetails).pipe(
      map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.set(user);
        return user;
      }
    )
      
    );
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}

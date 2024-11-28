import { HttpClient } from '@angular/common/http';
import { Injectable,inject, signal } from '@angular/core';
import { AppUser } from '../_models/appuser';
import { User } from '../_models/user';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private presenceService = inject(PresenceService);
  private http = inject(HttpClient);
  baseurl = environment.apiUrl;
  currentUser = signal<User|null>(null); // we can do this with observable as well

  constructor() { }

  login(userDetails:AppUser){
    return this.http.post<User>(this.baseurl + 'account/login',userDetails).pipe(
      map(user => {
       this.setCurrentUser(user);
        this.presenceService.createHubConnection(user);
      })
    );
  }

  
  register(userDetails:AppUser){
    return this.http.post<User>(this.baseurl + 'account/register',userDetails).pipe(
      map(user => {
        this.presenceService.createHubConnection(user);
        this.setCurrentUser(user);
        return user;
      }
    )
      
    );
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.presenceService.stopHubConnection();
  }

  setCurrentUser(user:User){
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
    this.presenceService.createHubConnection(user);
  }
}

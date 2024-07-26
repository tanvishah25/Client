import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AppUser } from '../_models/appuser';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient)
  public apiUrl = environment.apiUrl;

  GetUsersDetails(): Observable<AppUser[]> {
      return this.http.get<AppUser[]>(this.apiUrl);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AppUser } from '../_models/appuser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient)
  public apiUrl = "https://localhost:44391/api/users";

  GetUsersDetails(): Observable<AppUser[]> {
      return this.http.get<AppUser[]>(this.apiUrl);
  }
}

import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { PaginatedResults } from '../_models/pagination';
import { map, Observable, of } from 'rxjs';
import { UserParams } from '../_models/userparam';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
http = inject(HttpClient);
baseurl = environment.apiUrl;
memberCache = new Map();

constructor() { }

  // getMembers(){
  //   return this.http.get<Member[]>(this.baseurl+'users/GetAllUsers');
  // }

  getMembers(userParams:UserParams){
    //through MAP() we can set value in key value pair and using key we can get the cached record.
    //Object.values(userParams).join("-") using this line we are generating key for each paginated page along with number of records.
    
    const cacheResponse = this.memberCache.get(Object.values(userParams).join("-"));
    // based on key we will come to know that we already visited to that page or not 
    // If yes then we won't make api call we will provide cached record
    if(cacheResponse){
      //We need to emit the observable event for cache response as we are subscribing that in component.ts file
      return of(cacheResponse);
      //below and above piece of line are two options through which we can emit the observable event
      // return new Observable<HttpResponse<Member[]>>(observer =>{
      //   observer.next(cacheResponse);
      //   observer.complete();
      // })
    };

    var params = this.setPaginationHeaders(userParams);
    return this.http.get<Member[]>(this.baseurl + 'users/GetAllUsers', {observe:'response',params}).pipe(map(
      (response: HttpResponse<Member[]>) => {
        //store member details along with key
          this.memberCache.set(Object.values(userParams).join("-"),response);
          return response;
      }
    ));
  }

  setPaginationHeaders(userParams:UserParams){
    let params = new HttpParams();

    if(userParams.pageNumber && userParams.pageSize){
      params = params.append("PageNumber",userParams.pageNumber);
      params = params.append("PageSize",userParams.pageSize);
      params = params.append("Gender",userParams.gender);
      params = params.append("MinAge",userParams.minAge);
      params = params.append("MaxAge",userParams.maxAge);
      params = params.append("OrderBy",userParams.orderBy);
    }
      return params;

  }

  getMember(username:string){
    //The expression [...this.memberCache.values()] uses spread syntax (...) along with the values() method, 
    //and it is typically used in the context of working with a Map object in JavaScript
    //The spread syntax (...) is used to unpack elements from an iterable (like an array or an iterator) and put them into a new array.
    //In this case, ...this.memberCache.values() takes all the values from memberCache.values() and puts them into a new array.
    const member = [...this.memberCache.values()]
    // When we navigate to the second pagination page it will generate 2 array for that page.
    //by using reduce method we are concating second array with first array and searching using username
      .reduce((firstArray,secondArray) => firstArray.concat(secondArray.body), [])
      .find((m:Member) => m.userName == username);
  
      if(member) return of(member);
    return this.http.get<Member>(this.baseurl+'users/GetUserDetailsByUserName/' + username);
  }

  updateMember(member:Member){
    return this.http.put(this.baseurl+'users',member);
  }
}

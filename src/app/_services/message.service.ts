import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Message } from '../_models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseurl = environment.apiUrl;
  private http = inject(HttpClient);
  

  getMessages(pageNumber:number,pageSize:number,container:string){
    let params = this.setPaginationHeaders(pageNumber,pageSize,container);
    
    return this.http.get(this.baseurl+'messages',{observe:'response',params});
  }

  setPaginationHeaders(pageNumber:number,pageSize:number,container:string){
    let params = new HttpParams();

    if(pageNumber && pageSize){
      params = params.append("PageNumber",pageNumber);
      params = params.append("PageSize",pageSize);
      params = params.append("Container",container);
    }
      return params;
  }

  getMessageThread(username:string){
    return this.http.get(this.baseurl+'messages/thread/'+username);
  }

  sendMessage(username:string,content:string){
    return this.http.post<Message>(this.baseurl+'messages', {recipientUsername : username,content});
  }

  deleteMessage(id:number){
    return this.http.delete(this.baseurl+'messages/'+id);
  }

}

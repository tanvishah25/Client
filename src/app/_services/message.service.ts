import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Message } from '../_models/message';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseurl = environment.apiUrl;
  huburl = environment.hubsUrl;
  messageThread = signal<Message[]>([]);
  private hubConnection:HubConnection;
  private http = inject(HttpClient);
  
  CreateHubConnection(user:User,OtherUserName:string){
    this.hubConnection = new HubConnectionBuilder()
                        .withUrl(this.huburl+'message?username='+OtherUserName,{
                        accessTokenFactory : () => user.token
                        }).withAutomaticReconnect().build();
     this.hubConnection.start().catch(error => console.error(error));
     this.hubConnection.on("ReceivedMessageThread",messages =>{
        this.messageThread.set(messages);
     })          
     
     this.hubConnection.on("NewMessage", message => {
      //append new message inside messagethread
        this.messageThread.update(messages => [...messages,message]);
     })
                        
  }

  StopHubConnection(){
    if(this.hubConnection.state == HubConnectionState.Connected){
      this.hubConnection.stop();
    }
  }

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

  //Replace by SIgnalR code
  // getMessageThread(username:string){
  //   return this.http.get(this.baseurl+'messages/thread/'+username);
  // }

  //If don't add async then there is posibility that below method return undefined instead of promise<any>
  async sendMessage(username:string,content:string){
    //Before SignalR implementation we were calling api
    //return this.http.post<Message>(this.baseurl+'messages', {recipientUsername : username,content});

    //We need to invoke SendMessage method which there in MessageHub.cs 
    //because OnConnectedAsync method is override method so when HUB conntion start it will first call that method
    //But SendMessage method is custom method so we need to explictly invoke.

    return this.hubConnection?.invoke('SendMessage',{recipientUsername : username,content})
  }

  deleteMessage(id:number){
    return this.http.delete(this.baseurl+'messages/'+id);
  }

}

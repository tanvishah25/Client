import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
hubsUrl = environment.hubsUrl;
private hubConnection?: HubConnection;
private toaster = inject(ToastrService);
onlineUsers = signal<string[]>([]);

  createHubConnection(user:User){
    this.hubConnection = new HubConnectionBuilder()
                        .withUrl(this.hubsUrl+'presence',{
                          accessTokenFactory : ()=> user.token
                        }).withAutomaticReconnect().build();
     this.hubConnection.start().catch(error => console.log(error));

     this.hubConnection.on('UserIsOnline',username =>{
      this.toaster.info(username + ' has connected');
     })  
     
     this.hubConnection.on('UserIsOffline', username =>{
      this.toaster.warning(username,' has disconnected')
     })

     this.hubConnection.on('GetOnlineUsers', usernames =>{
      this.onlineUsers.set(usernames);
     })
  }

  stopHubConnection(){
    if(this.hubConnection.state == HubConnectionState.Connected){
      this.hubConnection.stop().catch(error=> console.log(error));
    }
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from '../_services/message.service';
import { PaginatedResults } from '../_models/pagination';
import { Message } from '../_models/message';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { RouterModule } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [ButtonsModule,FormsModule,TimeagoModule,RouterModule,PaginationModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit{
messageService = inject(MessageService);
container="Inbox";
pageNumber =1;
pageSize=5;
paginatedResults: PaginatedResults<Message[]> = new PaginatedResults<Message[]>();

ngOnInit(): void {
  this.loadMessages();
}

loadMessages(){
    this.messageService.getMessages(this.pageNumber,this.pageSize,this.container).subscribe({
      next: result =>{
          this.paginatedResults.items = result.body as Message[],
          this.paginatedResults.pagination = JSON.parse(result.headers.get('Pagination'));
      }
    })
}

getRoute(message:Message){
  if(this.container == "Outbox") return `/members/${message.recipientUsername}`;
 else return `/members/${message.senderUsername}`;
}

pageChanged(event){
  if(this.pageNumber != event.page){
    this.pageNumber = event.page;
    this.loadMessages();
  }
}

deleteMessage(id:number){
    this.messageService.deleteMessage(id).subscribe({
      next: _=>{
        //Difference between splice and slice
        const index = this.paginatedResults.items.findIndex(m => m.id == id);
          this.paginatedResults.items.splice(index,1);
          return this.paginatedResults;
      }
    })
}
}

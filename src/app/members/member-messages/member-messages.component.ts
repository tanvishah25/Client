import { Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import { MessageService } from '../../_services/message.service';
import { Message } from '../../_models/message';
import { TimeagoModule } from 'ngx-timeago';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [TimeagoModule,ReactiveFormsModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent implements OnInit {
  messageGroup:FormGroup;
  @Input() userName: string;
  @Input() messages:Message[];
  @Output() updatedMessages = new EventEmitter<Message>();
  formBuilder=inject(FormBuilder);
  messageService = inject(MessageService);

  ngOnInit(): void {
    this.messageGroup = this.formBuilder.group({
      content:[]
    })
  }
 
  SendMessage(){
    this.messageService.sendMessage(this.userName,this.messageGroup.value.content).subscribe({
      next: message =>{
       this.updatedMessages.emit(message);
       this.messageGroup.reset();
      }
    })
  }
}

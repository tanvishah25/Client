import { Component,inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../_models/member';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { Message } from '../../_models/message';
import { MessageService } from '../../_services/message.service';
// import {GalleryModule} from 'ng-gallery'
// GalleryModule

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule,TimeagoModule,DatePipe,MemberMessagesComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit{
  //static:true - memberTabs will be availble when the view is created means it will be available inside our ngonint
  //static:false - memberTabs will be availble after the view is fully initalised means it won't be available inside our ngonint
@ViewChild('memberTabs',{static:true}) memberTabs?: TabsetComponent
  username:string;
  private memberService = inject(MembersService)
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  member:Member;
  activeTab:TabDirective;
  messages:Message[] =[];
  content:string;
  message:Message;

  ngOnInit(): void {
    // With the help of resolver service we will load user detail before loading component.
    // this.loadMember();
    this.route.data.subscribe({
      next : data =>
        this.member = data['memberDetailedResolver']
    })

    this.route.queryParams.subscribe({
      next : params =>
        params['tab'] && this.selectTab(params['tab'])
    })
  }

  selectTab(heading:string){
    if(this.memberTabs){
      const messageTab = this.memberTabs.tabs.find(x=>x.heading === heading);
      if(messageTab) messageTab.active = true;
    }
  }

  onTabActivated(data:TabDirective){
    this.activeTab = data;
    if(this.activeTab.heading === 'Messages' && this.messages.length == 0 && this.member){
        this.messageService.getMessageThread(this.member.userName).subscribe({
          next: result => this.messages = result as Message[]
        })
    }
  }

  onUpdateMessages(event:Message){
    this.messages.push(event);
  }

  // loadMember(){
  //   const username = this.route.snapshot.paramMap.get('username');
  //   if(!username) return;
  //   this.memberService.getMember(username).subscribe({
  //     next: value => {
  //       this.member = value
  //     }
  //   })
  // }
}

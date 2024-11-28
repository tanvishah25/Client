import { Component,inject, OnDestroy, OnInit, ViewChild, viewChild } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../_models/member';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { Message } from '../../_models/message';
import { MessageService } from '../../_services/message.service';
import { PresenceService } from '../../_services/presence.service';
import { AccountService } from '../../_services/account.service';
// import {GalleryModule} from 'ng-gallery'
// GalleryModule

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule,TimeagoModule,DatePipe,MemberMessagesComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit,OnDestroy{
  //static:true - memberTabs will be availble when the view is created means it will be available inside our ngonint
  //static:false - memberTabs will be availble after the view is fully initalised means it won't be available inside our ngonint
@ViewChild('memberTabs',{static:true}) memberTabs?: TabsetComponent
  username:string;
  private memberService = inject(MembersService)
  private messageService = inject(MessageService);
  private accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  member:Member;
  activeTab:TabDirective;
  //SignalR - we are getting Messagethread using signal() 
  // messages:Message[] =[];
  content:string;
  message:Message;
  presenceService = inject(PresenceService);

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
    // && this.messages.length == 0
    if(this.activeTab.heading === 'Messages' && this.member){
      const user = this.accountService.currentUser();
      if(!user) return;
      this.messageService.CreateHubConnection(user,this.member.userName)
      //Without SignalR implementation
        // this.messageService.getMessageThread(this.member.userName).subscribe({
        //   next: result => this.messages = result as Message[]
        // })
    }
    else{
      this.messageService.StopHubConnection();
    }
  }

  //SignalR - we are getting Messagethread using signal() 
  // onUpdateMessages(event:Message){
  //   this.messages.push(event);
  // }

  ngOnDestroy(): void {
    this.messageService.StopHubConnection();
  }

  //When we are not using resolver service at that time loading messages by calling below method in ngonint() 
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

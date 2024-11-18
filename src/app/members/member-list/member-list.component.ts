import { Component, OnInit ,inject} from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { Member } from '../../_models/member';
import { MemberCardComponent } from "../member-card/member-card.component";
import { PaginatedResults } from '../../_models/pagination';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import { UserParams } from '../../_models/userparam';
import { AccountService } from '../../_services/account.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {ButtonsModule} from 'ngx-bootstrap/buttons'
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent,PaginationModule,ReactiveFormsModule,ButtonsModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
//members:Member[];  
sortingForm:FormGroup;
formbuilder = inject(FormBuilder);
memberService = inject(MembersService);
accountService = inject(AccountService);
paginatedResults: PaginatedResults<Member[]> = new PaginatedResults<Member[]>();
userParams:UserParams = new UserParams(this.accountService.currentUser());

  ngOnInit(): void {
    this.sortingForm = this.formbuilder.group({
      minAge:[this.userParams.minAge,Validators.required],
      maxAge:[this.userParams.maxAge,Validators.required],
      gender:[this.userParams.gender,Validators.required],
      orderBy:[this.userParams.orderBy]
    })

    if(!this.paginatedResults.items){
      this.loadMembers();
    }

  }


  loadMembers(){
    if(this.sortingForm?.value){
      this.userParams.gender  = this.sortingForm.value.gender;
      this.userParams.minAge  =  this.sortingForm.value.minAge;
      this.userParams.maxAge  = this.sortingForm.value.maxAge;
      this.userParams.orderBy = this.sortingForm.value.orderBy;
    }
    this.memberService.getMembers(this.userParams).subscribe({
      next: (response: HttpResponse<Member[]>) => {
         this.paginatedResults.items = response?.body as Member[];
        this.paginatedResults.pagination = JSON.parse(response.headers.get('Pagination'));
      }
    })
  }

  resetFilters(){
    this.sortingForm.reset(new UserParams(this.accountService.currentUser()));
    this.loadMembers();
  }

  pageChanged(event){
    this.userParams.pageNumber = event.page;
    this.loadMembers();
  }
}

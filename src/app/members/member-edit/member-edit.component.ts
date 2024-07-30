import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Member } from '../../_models/member';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { count } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [TabsModule,ReactiveFormsModule],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit{
@HostListener('window:beforeunload', ['$event']) y($event:any){
  if(this.memberForm.touched){
    $event.returnValue = true;
  }
}

 memberForm:FormGroup;
formBuilder=inject(FormBuilder);
member?:Member;
private accountService = inject(AccountService);
private memberService = inject(MembersService);
private toaster = inject(ToastrService);

ngOnInit(): void {
  this.memberForm = this.formBuilder.group({
    introduction:['',Validators.required],
    lookingFor:['',Validators.required],
    interests:['',Validators.required],
    city:['',Validators.required],
    country:['',Validators.required]
  });
  this.loadUser();
}

loadUser(){
  const currentUser = this.accountService.currentUser();
  this.memberService.getMember(currentUser.username).subscribe({
    next: response => {
      this.memberForm.patchValue({
        introduction : response.introduction,
        lookingFor : response.lookingFor,
        interests :response.interests,
        city:response.city,
        country:response.country
      })
      this.member = response;
    }
  })
}

updateProfile(){
 this.memberService.updateMember(this.memberForm.value).subscribe({
  next: result => {
    this.toaster.success("profile updated");
    this.memberForm.reset(this.member);
  },
  error: err=> this.toaster.error(err.error)
 });
}
}

import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule ,FormGroup , FormBuilder, Validators} from '@angular/forms';
import { AppUser } from '../_models/appuser';
import { AccountService } from '../_services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterLink, RouterLinkActive,Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [ReactiveFormsModule,BsDropdownModule,RouterLink,RouterLinkActive,TitleCasePipe],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
userForm:FormGroup;
userDetails:AppUser;
response:any;

constructor(private formBuilder:FormBuilder, 
  public accountService:AccountService,
  private router:Router, private toastr:ToastrService){}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })
  }

  login(){
    this.userDetails = this.userForm.value;
    this.accountService.login(this.userDetails).subscribe({
      next: result => {
       this.router.navigateByUrl('/members');
      },
      error: err=>this.toastr.error(err.error)
    })
  }

  logout(){
    this.onReset();
    this.accountService.logout();
    this.router.navigate(['/']);
  }

  onReset(){
    this.userForm.reset();
  }
}

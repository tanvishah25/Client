import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule ,FormGroup , FormBuilder, Validators} from '@angular/forms';
import { AppUser } from '../_models/appuser';
import { AccountService } from '../_services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [ReactiveFormsModule,BsDropdownModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
userForm:FormGroup;
userDetails:AppUser;
response:any;

constructor(private formBuilder:FormBuilder, public accountService:AccountService){}

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
        console.log(result);
      },
      error: err=>console.log(err)
    })
  }

  logout(){
    this.onReset();
    this.accountService.logout();
  }

  onReset(){
    this.userForm.reset();
  }
}

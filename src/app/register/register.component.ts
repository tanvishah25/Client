import { Component, EventEmitter, Input, OnInit, Output, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppUser } from '../_models/appuser';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
registerForm:FormGroup;
model:any={};
@Input() userListFromPraent:AppUser[];
@Output() cancelRegister = new EventEmitter();

constructor(private formBuilder:FormBuilder,
  private accountService:AccountService,private toastr:ToastrService){

}

ngOnInit(): void {
  this.registerForm = this.formBuilder.group({
    username:['',Validators.required],
    password:['',Validators.required]
  })
}

register(){
  this.model = this.registerForm.value;
  this.accountService.register(this.model).subscribe({
    next : response => {
      console.log(response);
      this.cancel();
    },
    error:err => this.toastr.error(err.error)
  })
}

cancel(){
  this.registerForm.reset();
  this.cancelRegister.emit(false);
}
}

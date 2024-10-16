import { Component, EventEmitter, Input, OnInit, Output, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AppUser } from '../_models/appuser';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,JsonPipe],
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
    password:['',Validators.required],
    confirmpassword:['',(Validators.required , this.matchValues("password"))]
  });
  this.registerForm.controls["password"].valueChanges.subscribe({
    next : () => this.registerForm.controls["confirmpassword"].updateValueAndValidity()
  })
}

matchValues(matchto:string) : ValidatorFn{
    return function(control:AbstractControl){
      return control.value == control.parent?.get(matchto)?.value ? null : {isMatchibg:true}
    }
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

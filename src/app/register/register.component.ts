import { Component, EventEmitter, Input, OnInit, Output, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppUser } from '../_models/appuser';
import { AccountService } from '../_services/account.service';

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

constructor(private formBuilder:FormBuilder,private accountService:AccountService){

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
    }
  })
}

cancel(){
  this.registerForm.reset();
  this.cancelRegister.emit(false);
}
}

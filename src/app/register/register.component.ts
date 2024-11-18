import { Component, EventEmitter, inject, input, Input, OnInit, Output, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AppUser } from '../_models/appuser';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { JsonPipe, NgIf } from '@angular/common';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,JsonPipe,NgIf, BsDatepickerModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
registerForm:FormGroup;
model:any={};
router = inject(Router);
@Input() userListFromPraent:AppUser[];
@Output() cancelRegister = new EventEmitter();
bsconfig?:Partial<BsDatepickerConfig>;
maxDate = input<Date>();

constructor(private formBuilder:FormBuilder,
  private accountService:AccountService,private toastr:ToastrService){
    this.bsconfig = {
      containerClass: "theme-red",
      dateInputFormat: "DD MMMM YYYY"
    }
}

ngOnInit(): void {
  this.registerForm = this.formBuilder.group({
    gender:['male'],
    knownAs:['',Validators.required],
    dateOfBirth:['',Validators.required],
    city:['',Validators.required],
    country:['',Validators.required],
    username:['',Validators.required],
    password:[
      '',
      [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8)
      ]
    ],
    confirmpassword:[
      '',
      [
        Validators.required , 
        this.matchValues("password")
      ]]
  });
  this.registerForm.controls["password"].valueChanges.subscribe({
    next : () => this.registerForm.controls["confirmpassword"].updateValueAndValidity()
  })
}

matchValues(matchto:string) : ValidatorFn{
    return function(control:AbstractControl){
      return control.value == control.parent?.get(matchto)?.value ? null : {isMatching:true}
    }
}

register(){
  this.model = this.registerForm.value;
  this.model.dateOfBirth =this.registerForm.get('dateOfBirth')?.value.toDateString();
  this.accountService.register(this.model).subscribe({
    next : _ => {
      this.router.navigateByUrl('/members');
    },
    error:err => this.toastr.error(err.error)
  })
}

cancel(){
  this.registerForm.reset();
  this.cancelRegister.emit(false);
}
}

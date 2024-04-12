import { BusinessService } from './../../services/business.service';
import { Component, OnInit,TemplateRef  } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  customerLoginForm:FormGroup;
  customerPwdForm:FormGroup;
  arePlansAvailable:boolean = false;
  modalRef?: BsModalRef;
  constructor(public authService: AuthService,public bizService:BusinessService,public fb:FormBuilder,public router:Router,private modalService: BsModalService) {
    this.loginForm = this.fb.group({
      primaryMobile:[''],
      password:['']
    })

    this.customerLoginForm = this.fb.group({
      mobile:['']
    })

    this.customerPwdForm = this.fb.group({
      password:['']
    })
  }

  ngOnInit(): void {
  }

  businessLogin(){
    this.authService.businessLogin(this.loginForm.value).subscribe((res:any)=>{
      if(res.length){
        alert('login successful');
        window.localStorage.setItem('currentBusiness',JSON.stringify(res[0]));
        this.authService.currentBusiness = res[0];
        if(this.arePlansAvailable){
          this.router.navigate(['/dashboard']);
        }
        else{
          this.router.navigate(['/addPlans']);
        }
      }
      else{
        alert("Invalid credentials")
      }
    })
  }

  customerLogin(modaltemplate:TemplateRef<any>){
    this.authService.customerLogin(this.customerLoginForm.value).subscribe((res:any)=>{
      if(res.length){
        alert('login successful');
        this.modalRef?.hide();
        if(!res[0].password){
          this.modalRef = this.modalService.show(modaltemplate);
        }
        else{
          this.router.navigate(['/'])
        }
      }
      else{
        alert("Invalid credentials")
      }
    })
  }

  createPassword(){
    this.bizService.createPwdForCustomer(this.customerLoginForm.value.mobile,this.customerPwdForm.value).subscribe((res)=>{
      alert('Password added successfully');
      this.modalService.hide();
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}

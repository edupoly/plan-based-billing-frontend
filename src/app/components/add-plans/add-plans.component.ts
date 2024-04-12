import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BusinessService } from 'src/app/services/business.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add-plans',
  templateUrl: './add-plans.component.html',
  styleUrls: ['./add-plans.component.scss'],
})
export class AddPlansComponent implements OnInit {
  plansForm: FormGroup;
  customerForm: FormGroup;
  addServiceForm: FormGroup;
  fetchCustomerForm:FormGroup;
  generateInvoiceForm:FormGroup;
  currentBusiness: any;
  modalRef?: BsModalRef;
  customerDetails:any = null;
  allServices:any = []
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public bizService: BusinessService,
    public router: Router,
    private modalService: BsModalService
  ) {
    this.plansForm = this.fb.group({
      plans: this.fb.array([]),
    });
    this.customerForm = this.fb.group({
      mobile: [''],
      plan: [''],
    });
    this.addServiceForm = this.fb.group({
      services: this.fb.array([
        this.fb.group({
          title: [''],
          price: [''],
        }),
      ]),
    });

    this.fetchCustomerForm = this.fb.group({
      mobile: ['']
    });

    this.generateInvoiceForm = this.fb.group({
      custServices: new FormArray([]),
    });
  }

  ngOnInit(): void {
    if (this.authService.currentBusiness) {
      this.currentBusiness = this.authService.currentBusiness;
    } else {
      this.authService.currentBusiness = JSON.parse(
        window.localStorage.getItem('currentBusiness') as string
      );
      this.currentBusiness = this.authService.currentBusiness;
    }
  }

  get plans() {
    return this.plansForm.get('plans') as FormArray;
  }

  get services() {
    return this.addServiceForm.get('services') as FormArray;
  }

  addPlan() {
    let plan = this.fb.group({
      title: [''],
      discount: [''],
      price: [''],
    });
    this.plans.push(plan);
  }

  addService() {
    let service = this.fb.group({
      title: [''],
      price: [''],
    });
    this.services.push(service);
  }

  handleCheckbox(event:any){
    let userServices = this.generateInvoiceForm.get('custServices') as FormArray;
    if(event.target.checked){
      userServices.push(new FormControl(event.target.value));
    }
    else{
      userServices.controls.forEach((ctrl:any,i:any)=>{
        if(ctrl.value===event.target.value){
          userServices.removeAt(i);
          return;
        }
      })
    }
    console.log(this.generateInvoiceForm.value)
  }

  savePlans() {
    this.bizService
      .updatePlans(this.currentBusiness._id, this.plansForm.value)
      .subscribe((res) => {
        alert(`Plans updated for ${this.currentBusiness.businessName}`);
      });
  }

  saveCustomer() {
    this.bizService
      .addCustomer(
        this.customerForm.value,
        this.currentBusiness._id
      )
      .subscribe((res) => {
        alert(`Customer ${res} added successfully`);
      });
  }

  openAddServiceModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  saveServices() {
    this.bizService
      .updateServices(this.currentBusiness._id, this.addServiceForm.value)
      .subscribe((res) => {
        alert(`Services updated for ${this.currentBusiness.businessName}`);
      });
  }

  openGenerateInvoiceModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getCustomerDetails(){
    console.log(this.currentBusiness._id)
    this.bizService.fetchCustomerDetails(this.currentBusiness._id,this.fetchCustomerForm.value.mobile).subscribe((res:any)=>{
      console.log(res)
      this.customerDetails = res[0].customers[0]
      console.log(this.customerDetails)
      this.bizService.fetchAllServices(this.currentBusiness._id).subscribe((services:any)=>{
        this.allServices = services[0].services
      });
    })
  }

  generateInvoice(){
    let generatedInvoice:any = {}
    let totalPrice = this.allServices.reduce((acc:any,serv:any)=>{
      if(this.generateInvoiceForm.value.custServices.some((cs:any)=>{
        return serv.title===cs;
      })){
        return acc+parseInt(serv.price);
      }
      else{
        return acc;
      }
    },0);
    generatedInvoice.date = new Date();
    generatedInvoice.customerMobile = this.customerDetails.mobile;
    generatedInvoice.plan = this.customerDetails.plan;
    generatedInvoice.availedServices = this.generateInvoiceForm.value.custServices;
    generatedInvoice.totalBill = totalPrice;
    this.bizService.addInvoice(this.currentBusiness._id,generatedInvoice).subscribe((res)=>{
      alert(`Invoice of amount ${res} successfully added`);
      this.modalRef?.hide();
    })
  }

  logout() {
    this.authService.currentBusiness = null;
    window.localStorage.clear();
    this.router.navigate(['/login']);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  dbUrl:any = 'http://localhost:4600';
  constructor(public http:HttpClient) { }

  updatePlans(bid:any,plans:any){
    return this.http.patch(`${this.dbUrl}/updatePlansById/${bid}`,plans);
  }

  updateServices(bid:any,services:any){
    return this.http.patch(`${this.dbUrl}/updateServicesById/${bid}`,services);
  }

  addCustomer(customer:any,bId:any){
    return this.http.post(`${this.dbUrl}/addCustomer/${bId}`,customer);
  }

  createPwdForCustomer(mobile:any,password:any){
    return this.http.patch(`${this.dbUrl}/createPassword/${mobile}`,password);
  }

  fetchCustomerDetails(bId:any,mobile:any){
    return this.http.get(`${this.dbUrl}/getCustomerDetails/${bId}/${mobile}`);
  }

  fetchAllServices(bId:string){
    return this.http.get(`${this.dbUrl}/getServices/${bId}`);
  }

  addInvoice(bId:any,invoice:any){
    return this.http.post(`${this.dbUrl}/addTransaction/${bId}`,invoice);
  }
}

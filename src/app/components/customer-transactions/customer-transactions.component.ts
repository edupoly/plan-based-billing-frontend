import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer-transactions',
  templateUrl: './customer-transactions.component.html',
  styleUrls: ['./customer-transactions.component.scss']
})
export class CustomerTransactionsComponent implements OnInit {
  currentCustomer: any;
  allTransactions:any = [];
  filteredTransactions:any = [];
  constructor(public authService: AuthService,public custService:CustomerService) { }

  ngOnInit(): void {
    this.currentCustomer = this.authService.currentCustomer;
    this.getAllTransactions();
  }

  getAllTransactions(){
    this.custService.fetchCustomerTransactions(this.currentCustomer.mobile).subscribe((res)=>{
      this.filteredTransactions = this.allTransactions = res;
    })
  }

  handleDateChange(dateRange: any) {
    console.log(dateRange[0]);
    console.log(typeof dateRange[0]);
    this.filteredTransactions = this.allTransactions.filter(
      (transaction: any) => {
        return (
          transaction.date >= dateRange[0].getTime() &&
          transaction.date <= dateRange[1].getTime()
        );
      }
    );
  }

}

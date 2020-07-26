import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.page.html',
  styleUrls: ['./billing.page.scss'],
})
export class BillingPage implements OnInit {

  noOfTankers = 50;
  slab1 = 18000;
  slab2 = 23000;
  slab1Cost = 0.1;
  slab2Cost = 0.4;
  slab3Cost = 1.3;
  months = ["Jan","Feb","March","April"];
  selectedMonth = this.months[this.months.length-1];


  constructor(public loadingController: LoadingController) { }

  ngOnInit() {
  }

  generateReport(){
    console.log(this.noOfTankers)
  }

  async calculateSlabs(){
    await this.showLoader();
    console.log(this.selectedMonth);
    console.log(this.noOfTankers);
    await this.hideLoader();
  }

  // Show the loader for infinite time
  showLoader() {
    return new Promise((resolve, reject) => {
      this.loadingController.create({
        message: 'Please wait...'
      }).then((res) => {
        res.present();
        resolve();
      });
    });

  }

  // Hide the loader if already created otherwise return error
  hideLoader() {

    this.loadingController.dismiss().then((res) => {
      console.log('Loading dismissed!', res);
    }).catch((error) => {
      console.log('error', error);
    });

  }


}

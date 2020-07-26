import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.page.html',
  styleUrls: ['./billing.page.scss'],
})
export class BillingPage implements OnInit {

  noOfTankers = 5;
  slab1 = 18000;
  slab2 = 23000;
  slab1Cost = 0.1;
  slab2Cost = 0.4;
  slab3Cost = 1.3;
  costPerTanker = 1000;
  disabled = false;
  months = ["Jan 2020","Feb 2020","March 2020","April 2020","May 2020","June 2020","July 2020"];
  selectedMonth = this.months[this.months.length-1];
  pdfReadings = [];


  constructor(public loadingController: LoadingController, private databaseService: DatabaseService, private platform: Platform,) {



   }

  ngOnInit() {
   this.platform.ready().then(async() => {
     await this.showLoader();
     let pdfData:any = await this.databaseService.getBillData(this.selectedMonth, this.months[this.months.indexOf(this.selectedMonth) - 1], this.noOfTankers, this.slab3Cost, this.costPerTanker);
     console.log(pdfData);
     if(pdfData.error){
      alert(pdfData.error);
      this.disabled = true;
     } else {
       this.slab1 = pdfData.slab1;
       this.slab2 = pdfData.slab2;
       this.pdfReadings = pdfData.flatbill;
     }

     await this.hideLoader();
   });
   
  }

  generateReport(){
    console.log(this.noOfTankers)
  }

  async calculateSlabs(){
    await this.showLoader();
    let pdfData: any = await this.databaseService.getBillData(this.selectedMonth, this.months[this.months.indexOf(this.selectedMonth) - 1], this.noOfTankers, this.slab3Cost, this.costPerTanker);
    console.log(pdfData);
    if (pdfData.error) {
      alert(pdfData.error);
      this.disabled = true;
    } else {
      this.slab1 = pdfData.slab1;
      this.slab2 = pdfData.slab2;
      this.pdfReadings = pdfData.flatbill;
    }
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

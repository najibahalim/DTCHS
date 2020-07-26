import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { Platform } from '@ionic/angular';
import { PDFUtils } from './pdftemplate'
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import pdfMake from 'pdfmake/build/pdfmake';

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
  pdfObj; //final Pdf created


  constructor(public loadingController: LoadingController, private databaseService: DatabaseService, private platform: Platform, private plt: Platform, private dbService: DatabaseService, private file: File, private fileOpener: FileOpener) {



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

  async generateReport() {
    await this.showLoader();
    //calculate total cost
    this.pdfReadings.forEach(reading=>{
      let flatReading = reading.totalReading;
      let cost1 = Math.min(this.slab1, flatReading) * this.slab1Cost;
      flatReading -= this.slab1;
      let cost2 = 0;
      if (flatReading > 0)
        cost2 = Math.min(this.slab2, flatReading) * this.slab2Cost;
      flatReading -= this.slab2;
      let cost3 = Math.max(0, flatReading) * this.slab3Cost;
      reading.total = Math.round(cost1 + cost2 + cost3);
    });
    try {
      //get main params set
      var docDefinition = await PDFUtils.generatePdfObj({
        month: (this.selectedMonth).toUpperCase(),
        prevMonth: (this.months[this.months.indexOf(this.selectedMonth) - 1].split(' ')[0]).toUpperCase(),
        currMonth: (this.selectedMonth.split(' ')[0]).toUpperCase(),
        slab1: this.slab1,
        slab2: this.slab2,
        slab1Cost: this.slab1Cost,
        slab2Cost: this.slab2Cost,
        slab3Cost: this.slab3Cost
      },this.pdfReadings);
      //generate pdf
      this.pdfObj = await pdfMake.createPdf(docDefinition);
      await this.downloadPdf();

    } catch(err){
      console.log(err);
      alert('Error while generating PDF.')
      this.hideLoader();
    }
   
    
    
  }

  downloadPdf() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer(async (buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });

        // Save the PDF to the data Directory of our App
        let url = await this.dbService.getStoragePath("Bills");
        this.file.writeFile(url, 'DTCHS.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.hideLoader();
          this.fileOpener.open(url + 'DTCHS.pdf', 'application/pdf');

        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }


}

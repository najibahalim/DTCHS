import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { AddReadingDataService, flats } from '../services/data.service';
import { LoadingController } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-add-readings-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class AddReadingsHome {
  months = [];
  dates = [];
  ticks1 = [];
  ticks2 = [];
  constructor(private data: DataService, private activatedRoute: ActivatedRoute, private addReadingData: AddReadingDataService, private platform: Platform, public loadingController: LoadingController, private databaseService: DatabaseService) {


  }

  ngOnInit() {
    this.platform.ready().then(async () => {
      await this.showLoader();
      let dateData = this.addReadingData.getMonths();
      this.months = dateData.months;
      this.dates = dateData.dates;
      console.log(this.months);

      const id = this.activatedRoute.snapshot.paramMap.get('id');
      // const dataPresent = await this.databaseService.dataAddedCount();
      // this.months.forEach(month => {
      //   this.ticks1.push(dataPresent[new Date(month).toString()] >= 194);
      // });
      // let count = 0;  
      // for(let i=0; i<flats.length;i++){
      //   if(await this.databaseService.checkImage("",flats[i].substring(0,5)){
      //     count++;
      //   }
      // }
      await this.hideLoader();
    });
  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

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

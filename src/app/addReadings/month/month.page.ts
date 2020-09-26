import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { AddReadingDataService } from '../services/data.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LoadingController } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-add-month',
  templateUrl: 'month.page.html',
  styleUrls: ['month.page.scss'],
})
export class AddMonthReadings {
  date;
  displayDate = "";
  flats: any[];

  constructor(private data: DataService, private activatedRoute: ActivatedRoute, private addReadingData: AddReadingDataService, private nativeStorage: NativeStorage, private platform: Platform, public loadingController: LoadingController, private databaseService: DatabaseService) {
    this.flats = addReadingData.getFlatsBySection();

  }

  saveDate = () => {
    this.nativeStorage.setItem('date', { value: this.date.toString() })
      .then(
        () => console.log('Stored item!'),
        error => console.log('Error storing item' + JSON.stringify(error))
      );
  }

  ngOnInit() {
    this.platform.ready().then(async () => {
    await this.showLoader();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.date = new Date(Number(id));
    this.displayDate = this.date.toLocaleString('default', { month: 'long' }) + ' ' + this.date.getFullYear();
    this.saveDate();
    const ticksData = await this.databaseService.getSectionTicks(this.date.toString());
    for(let i=0; i<this.flats.length;i++){
      let count1 = 0;
      let count2 = 0;
      const fileName = this.date.getFullYear() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getDate();
      for(let j=0;j<this.flats[i].flats.length;j++){
        if (ticksData.includes(this.flats[i].flats[j])) {
          count1++;
        }
        if(await this.databaseService.checkImage(fileName + this.flats[i].flats[j].charAt(5) + ".jpg", this.flats[i].flats[j].substring(0,5) )){
          count2++;
        }
      }
      
      this.flats[i].tick1 = count1 === this.flats[i].count;
      this.flats[i].tick2 = count2 === this.flats[i].count;
    }
  
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

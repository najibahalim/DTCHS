import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { AddReadingDataService } from '../services/data.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { DatabaseService } from '../../services/database.service';
import { LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';



@Component({
  selector: 'app-sections',
  templateUrl: 'section.page.html',
  styleUrls: ['section.page.scss'],
})
export class AddSectionReadings {
  date;
  displayDate = "";
  flats: any;
  section;

  constructor(private data: DataService, private activatedRoute: ActivatedRoute, private addReadingData: AddReadingDataService, private nativeStorage: NativeStorage,
    private databaseService: DatabaseService, public loadingController: LoadingController,
    private platform: Platform) {
    this.flats = addReadingData.getFlatsBySection();

  }

  async getDate() {
    return new Promise((resolve, reject) => {
      this.nativeStorage.getItem('date')
        .then((date) => {
          this.date = new Date(date.value);
          this.displayDate = this.date.toLocaleString('default', { month: 'long' }) + ' ' + this.date.getFullYear();
          resolve();
        }).catch(err => {
          console.log("cannot get date");
        });
    });

  }



  ngOnInit() {
    this.platform.ready().then(async () => {
      await this.showLoader();
      const id = this.activatedRoute.snapshot.paramMap.get('id');
      this.section = id;
      await this.getDate();
      this.flats = this.flats.filter(flat => {
        return flat.name === id;
      });
      this.flats = this.flats[0].flats;
      const flatIds = this.flats.map(flat => {
        return flat.substring(0, flat.length - 1);
      });
      const type = this.flats[0].charAt(this.flats[0].length - 1) === 'K' ? "Kitchen" : "Toilet";
      const dataPresent = await this.databaseService.getTicks(this.date.toString(), flatIds, type);
      this.flats = this.flats.map(flat => {
        return {
          label: flat,
          tick1: dataPresent.findIndex(d => flat.startsWith(d.flat)) >= 0,
          tick2: false,
        }
      });
      const fileName = this.date.getFullYear() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getDate();
      for(let i=0;i<this.flats.length; i++) {

        this.flats[i].tick2 = await this.databaseService.checkImage(fileName + this.flats[i].label.charAt(this.flats[i].label.length -1 ) + ".jpg", flatIds[i]);
      }
      
      await this.hideLoader();
    });

  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
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

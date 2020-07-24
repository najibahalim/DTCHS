import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { AddReadingDataService } from '../services/data.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';


@Component({
  selector: 'app-add-month',
  templateUrl: 'month.page.html',
  styleUrls: ['month.page.scss'],
})
export class AddMonthReadings {
  date;
  displayDate = "";
  flats: string[];

  constructor(private data: DataService, private activatedRoute: ActivatedRoute, private addReadingData: AddReadingDataService, private nativeStorage: NativeStorage) {
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
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.date = new Date(Number(id));
    this.displayDate = this.date.toLocaleString('default', { month: 'long' }) + ' ' + this.date.getFullYear();
    this.saveDate();
  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }
 

}

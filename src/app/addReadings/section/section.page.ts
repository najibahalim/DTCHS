import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { AddReadingDataService } from '../services/data.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';


@Component({
  selector: 'app-sections',
  templateUrl: 'section.page.html',
  styleUrls: ['section.page.scss'],
})
export class AddSectionReadings {
  date;
  displayDate = "";
  flats;
  section;

  constructor(private data: DataService, private activatedRoute: ActivatedRoute, private addReadingData: AddReadingDataService, private nativeStorage: NativeStorage) {
    this.flats = addReadingData.getFlatsBySection();

  }

  getDate = () => {
    this.nativeStorage.getItem('date')
      .then((date) => {
          this.date = new Date(date.value);
          this.displayDate = this.date.toLocaleString('default', { month: 'long' }) + ' ' + this.date.getFullYear();
        }).catch(err=>{
          console.log("cannot get date");
        });
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.section = id;
    this.getDate();
    this.flats = this.flats.filter(flat=>{
      return flat.name === id;
    })
    this.flats = this.flats[0].flats;

  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }
 

}

import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import {AddReadingDataService} from '../services/data.service';

@Component({
  selector: 'app-add-readings-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class AddReadingsHome {
  months = [];
  dates = [];
  constructor(private data: DataService, private activatedRoute: ActivatedRoute, private addReadingData: AddReadingDataService) {
    let dateData = addReadingData.getMonths();
    this.months = dateData.months;
    this.dates = dateData.dates;
    console.log(this.months);

  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    
  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }
 

}

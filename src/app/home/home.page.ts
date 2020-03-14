import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  wings: {id: string, name: string}[];
  flats: string[];
  constructor(private data: DataService, private dbService: DatabaseService) {
    this.wings = [{id:"A",name:
      "A-Wing"},{id:"B",name:"B-Wing"},{id:"C",name:"C-Wing"}];
    this.flats = [];
    this.flats.push("G01");
    this.flats.push("G02");
    this.flats.push("G03");
    this.flats.push("G04");
    for(let i=1; i<=7; i++ ){
      this.flats.push(i + "01");
      this.flats.push(i + "02");
      this.flats.push(i + "03");
      this.flats.push(i + "04");

    }

  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  saveFile = () => {
    this.dbService.getXlsxFile();
  }

  shareFile = () => {
    this.dbService.shareXlsxFile();
  }
 

}

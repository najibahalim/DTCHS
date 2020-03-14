import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-flat',
  templateUrl: 'flat.page.html',
  styleUrls: ['flat.page.scss'],
})
export class FlatPage {
  wings: string[];
  flats: string[];
  wingId: string;
  constructor(private data: DataService, private activatedRoute: ActivatedRoute) {
    this.wings = ["A-Wing","B-Wing","C-Wing"];
    this.flats = [];
    this.flats.push("-G01");
    this.flats.push("-G02");
    this.flats.push("-G03");
    this.flats.push("-G04");
    for(let i=1; i<=7; i++ ){
      this.flats.push("-" + i + "01");
      this.flats.push("-" + i + "02");
      this.flats.push("-" + i + "03");
      this.flats.push("-" + i + "04");

    }

  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.wingId = id;
  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }
 

}

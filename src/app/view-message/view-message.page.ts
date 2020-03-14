import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
})
export class ViewMessagePage implements OnInit {
  @ViewChild('input',{static:true}) myInput;
  date:string = new Date().toString();
  kitchenReading: number ;
  toiletReading: number ;
  id: string;
  wing: string;
  readings: Object[];
  constructor(
    private data: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private databaseService: DatabaseService,
    private platform: Platform,
    public toastController: ToastController,
    private nativeStorage: NativeStorage
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.id= id;
    this.wing = id[0];
    console.log(id);
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener('backbutton', function (event) {
          event.preventDefault();
          event.stopPropagation();
          console.log('hello');
        }, false);
      });
      this.getDate();
      setTimeout(() => {
        this.myInput.setFocus();
      }, 150);
     this.databaseService.getEntries(this.id).then(data => {
       this.readings = data;
     });
    });
  }

  handleToiletValue = (event) => {
    this.toiletReading = event.target.value;

  }

  handleDate = (event) => {
    console.log(event.target.value);
    this.date = event.target.value;
    this.saveDate();

  }
  saveDate = () => {
    this.nativeStorage.setItem('date', {value: this.date.toString()})
      .then(
        () => console.log('Stored item!'),
        error => console.log('Error storing item' + JSON.stringify(error))
      );
  }
  getDate = () => {
    this.nativeStorage.getItem('date')
      .then(
        data => this.date = data.value,
        error => alert(JSON.stringify(error))
      );
  }
  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'Inbox' : '';
  }

  processEntry(route) {
    console.log("Processing Entry...");
    if(this.toiletReading >0 && this.kitchenReading > 0) {
      //Add the value in Database
      this.databaseService.addEntry(this.date, this.toiletReading, "Toilet", this.id);
      this.databaseService.addEntry(this.date, this.kitchenReading, "Kitchen", this.id);
      console.log("Values Added")
      this.kitchenReading = null;
      this.toiletReading = null;
      if (route === "back") {
        this.router.navigate(['/flat/' + this.wing]);
      } else {
        this.router.navigate([this.data.getNextFlat(this.id)])
      }
    } else {
      this.presentToast();
      console.log("Show Error")
    }
    
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Reading cannot be 0',
      duration: 5000,
      position: "top"
    });
    toast.present();
  }
  cancel() {
    this.router.navigate(['/flat/' + this.wing]);
  }
  home(){
    this.router.navigate(['home'])
  }
  handleKitchenValue = (event) => {
    this.kitchenReading = event.target.value;
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { PopoverController } from '@ionic/angular';
import {ImageViewerPage} from '../../image-viewer/image-viewer.page'
@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
})
export class ViewMessagePage implements OnInit {
  @ViewChild('input',{static:true}) myInput;
  date:string = new Date().toString();
  imageName: string;
  displayDate: string;
  reading: number ;
  type;
  previousReading
  id: string;
  flatId: string;
  wing: string;
  readings: any;
  win: any = window;
  imagePath = '';
  name = '';
  invalidValue = false;
  path = '';
  constructor(
    private data: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private databaseService: DatabaseService,
    private platform: Platform,
    public toastController: ToastController,
    private nativeStorage: NativeStorage,
    private camera: Camera,
    private file: File,
    public popoverController: PopoverController
  ) {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.flatId = id;
    this.type = id[id.length -1];
    if(this.type === 'T'){
      this.type = "Toilet";
    } else if(this.type === 'K') {
      this.type = "Kitchen"; 
    }

    this.id = id.slice(0, -1); ;
    this.wing = id[0];
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener('backbutton', function (event) {
          event.preventDefault();
          event.stopPropagation();
        }, false);
      });
      this.getDate();
      setTimeout(() => {
        this.myInput.setFocus();
      }, 150);
      this.databaseService.getEntries(this.id).then(data => {
        this.readings = data;
        let c_date = new Date(this.date);
        let p_date = new Date(this.date);
        p_date.setMonth(p_date.getMonth() - 1);
        let dateStr = c_date.getDate() + "/" + (c_date.getMonth() + 1) + "/" + c_date.getFullYear();
        let p_dateStr = p_date.getDate() + "/" + (p_date.getMonth() + 1) + "/" + p_date.getFullYear();
        let currentReading = data.find(reading => reading.date == dateStr);
        if(currentReading && currentReading.values && currentReading.values.length > 0){
          this.reading = currentReading.values.find(val=> val.type==this.type).value;
        }
        let previousReading = data.find(reading => reading.date == p_dateStr);
        if (previousReading && previousReading.values && previousReading.values.length > 0) {
          this.previousReading = Number(previousReading.values.find(val => val.type == this.type).value);
          console.log('TTTTT');
          console.log(this.previousReading);
          if(this.reading < this.previousReading){
            this.invalidValue = true;
          }
        }
      });
     
     
    });
  }
  

  async presentPopover(type, ev: any) {
    let imgPath = this.path;
   
    const popover = await this.popoverController.create({
      component: ImageViewerPage,
      event: ev,
      translucent: true,
      componentProps:{
        imageUrl: imgPath
      },
    });
    return await popover.present();
  }
  saveDate = () => {
    this.nativeStorage.setItem('date', {value: this.date.toString()})
      .then(
        () => console.log('Stored item!'),
        error => console.log('Error storing item' + JSON.stringify(error))
      );
  }
  getDate = () => {
    this.path = '';
    this.nativeStorage.getItem('date')
      .then(
        (data) => { 
        this.date = data.value; 
         
        let d = new Date(data.value);
          this.displayDate = d.toLocaleString('default', { month: 'long' }) + ' ' + d.getFullYear();
        this.name = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + this.type[0] + ".jpg";

         
      }
      ).catch(()=>{
        let d = new Date();
        this.name = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + this.type[0] + ".jpg";

      }).finally(()=>{
        this.databaseService.getImage(this.name, this.id).then((file) => {
          if (file) {
            this.path = this.win.Ionic.WebView.convertFileSrc(file.nativeURL);
          }
        });
        this.databaseService.getImage(this.name, this.id).then((file) => {
          if (file) {
            this.path = this.win.Ionic.WebView.convertFileSrc(file.nativeURL);
          }
        });
      });
  }
  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'Inbox' : '';
  }

  processEntry(route) {
    if ((this.reading && !this.invalidValue)|| this.path ) {
      //Add the value in Database
      if (this.reading){
        this.databaseService.addEntry(this.date, this.reading, this.type, this.id);
      }
      
      this.reading = null;
      if (route === "back") {
        this.router.navigate(['/addMonthReading/' + new Date(this.date).getTime()]);
      } else {
        this.router.navigate([this.data.getNextSectionFlat(this.id + this.type[0])]);
      }
    } else {
      this.presentToast();
    }
    
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Add reading or Image',
      duration: 5000,
      position: "top"
    });
    toast.present();
  }
  cancel() {
    this.router.navigate(['/addMonthReading/' + new Date(this.date).getTime()]);
  }
  home(){
    this.router.navigate(['home'])
  }
  handleValue = (event) => {
    this.reading = event.target.value;
    if (this.reading < this.previousReading) {
      this.invalidValue = true;
    } else {
      this.invalidValue = false;
    }
  }

  pickImage(type) {
    if(!this.date){
      alert("Add Date First!");
      return;
    }
    let imgName = this.name;;

    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetHeight: 500,
      targetWidth: 500
    }
    this.camera.getPicture(options).then((imageLink) => {
      const tempFilename = imageLink.substr(imageLink.lastIndexOf('/') + 1);
      const tempBaseFilesystemPath = imageLink.substr(0, imageLink.lastIndexOf('/') + 1);
      if(this.path){
       
          this.path = '';
        this.databaseService.changeImage(tempBaseFilesystemPath, tempFilename, imgName, this.id).then((url) => {
          this.path = this.win.Ionic.WebView.convertFileSrc(imageLink);
        });
      }else{
        this.databaseService.saveImage(tempBaseFilesystemPath, tempFilename, imgName, this.id).then((url) => {
          this.path = this.win.Ionic.WebView.convertFileSrc(imageLink);
        });
      }
     
    }, (err) => {
      // Handle error
    });
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { PopoverController } from '@ionic/angular';
import {ImageViewerPage} from '../image-viewer/image-viewer.page'
@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
})
export class ViewMessagePage implements OnInit {
  @ViewChild('input',{static:true}) myInput;
  date:string = new Date().toString();
  imageName: string;
  kitchenReading: any ;
  toiletReading: any ;
  id: string;
  wing: string;
  readings: any;
  win: any = window;
  imagePath = '';
  kitchenName = '';
  toiletName = '';
  kitchenPath = '';
  toiletPath = '';
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
        let c_date = new Date(this.date);
        let dateStr = c_date.getDate() + "/" + (c_date.getMonth() + 1) + "/" + c_date.getFullYear();
        let currentReading = data.find(reading => reading.date == dateStr);
        if(currentReading && currentReading.values && currentReading.values.length > 0){
          this.toiletReading = currentReading.values.find(val=> val.type=="Toilet");
          this.kitchenReading = currentReading.values.find(val=> val.type=="Kitchen");
          if(this.toiletReading){
            this.toiletReading = this.toiletReading.value;
          }
          if (this.kitchenReading) {
            this.kitchenReading = this.kitchenReading.value;
          }
        }
      });
     
     
    });
  }
  

  async presentPopover(type, ev: any) {
    let imgPath = '';
    if(type === 1 )
      imgPath = this.kitchenPath;
    else 
      imgPath = this.toiletPath;
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
  handleToiletValue = (event) => {
    this.toiletReading = event.target.value;

  }

  handleDate = (event) => {
    console.log(event.target.value);
    this.date = event.target.value;
    let d = new Date(event.target.value);
    let dateStr = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
    if(this.readings){
      let currentReading = this.readings.find(reading => reading.date == dateStr);
      if (currentReading && currentReading.values && currentReading.values.length > 0) {
        this.toiletReading = currentReading.values.find(val => val.type == "Toilet").value;
        this.kitchenReading = currentReading.values.find(val => val.type == "Kitchen").value;
      }
    }
   
    this.toiletName = d.getFullYear() + '-' + (d.getMonth() + 1) + '-'+ d.getDate() + "T.jpg";
    this.kitchenName = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + "K.jpg";
    this.toiletPath = '';
    this.kitchenPath = '';
    this.databaseService.getImage(this.toiletName, this.id).then((file) => {
      if (file) {
        this.toiletPath = this.win.Ionic.WebView.convertFileSrc(file.nativeURL);
      }
    });
    this.databaseService.getImage(this.kitchenName, this.id).then((file) => {
      if (file) {
        this.kitchenPath = this.win.Ionic.WebView.convertFileSrc(file.nativeURL);
      }
    });
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
    this.toiletPath = '';
    this.kitchenPath = '';
    this.nativeStorage.getItem('date')
      .then(
        (data) => { 
        this.date = data.value; 
        let d = new Date(data.value);
        this.toiletName = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + "T.jpg";
        this.kitchenName = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + "K.jpg";
         
      }
      ).catch(()=>{
        let d = new Date();
        this.toiletName = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + "T.jpg";
        this.kitchenName = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + "K.jpg";
      }).finally(()=>{
        this.databaseService.getImage(this.toiletName, this.id).then((file) => {
          if (file) {
            this.toiletPath = this.win.Ionic.WebView.convertFileSrc(file.nativeURL);
            console.log('$$$$$$$$');
            console.log(this.toiletPath);
          }
        });
        this.databaseService.getImage(this.kitchenName, this.id).then((file) => {
          if (file) {
            this.kitchenPath = this.win.Ionic.WebView.convertFileSrc(file.nativeURL);
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
    console.log("Processing Entry...");
    if((this.toiletReading  && this.kitchenReading ) || (this.kitchenPath!='' || this.toiletPath!='')) {
      //Add the value in Database
      if(this.toiletReading && this.kitchenReading){
        this.databaseService.addEntry(this.date, this.toiletReading, "Toilet", this.id);
        this.databaseService.addEntry(this.date, this.kitchenReading, "Kitchen", this.id);
        console.log("Values Added")
      }
      
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
      message: 'Add reading or Image',
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

  pickImage(type) {
    if(!this.date){
      alert("Add Date First!");
      return;
    }
    console.log(type)
    let imgName = '';
    if(type===1){
      imgName = this.kitchenName;
    } else {
      imgName = this.toiletName;
    }
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
      console.log(imageLink);
      const tempFilename = imageLink.substr(imageLink.lastIndexOf('/') + 1);
      const tempBaseFilesystemPath = imageLink.substr(0, imageLink.lastIndexOf('/') + 1);
      if((type === 1 && this.kitchenPath!='') || (type===2 && this.toiletPath!='')){
        if(type===1)
          this.kitchenPath = '';
        if(type ===2)
          this.toiletPath = '';
        this.databaseService.changeImage(tempBaseFilesystemPath, tempFilename, imgName, this.id).then((url) => {
          if(type === 1)
            this.kitchenPath = this.win.Ionic.WebView.convertFileSrc(imageLink);
          else 
            this.toiletPath = this.win.Ionic.WebView.convertFileSrc(imageLink);
        });
      }else{
        this.databaseService.saveImage(tempBaseFilesystemPath, tempFilename, imgName, this.id).then((url) => {
          if (type === 1)
            this.kitchenPath = this.win.Ionic.WebView.convertFileSrc(imageLink);
          else
            this.toiletPath = this.win.Ionic.WebView.convertFileSrc(imageLink);
        });
      }
     
    }, (err) => {
      // Handle error
    });
  }

  // showImage(ImagePath) {
  //   var copyPath = ImagePath;
  //   var splitPath = copyPath.split('/');
  //   var imageName = splitPath[splitPath.length - 1];
  //   var filePath = ImagePath.split(imageName)[0];

  //   this.file.readAsDataURL(filePath, imageName).then(base64 => {
  //     this.imagePath = base64;
  //   }, error => {
  //     alert('Error in showing image' + error);
  //   });
  // }

}

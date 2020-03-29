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
  kitchenReading: number ;
  toiletReading: number ;
  id: string;
  wing: string;
  readings: Object[];
  win: any = window;
  imagePath = '';
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
      });
     
     
    });
  }
  

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: ImageViewerPage,
      event: ev,
      translucent: true,
      componentProps:{
        imageUrl: this.imagePath
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
    this.imageName = new Date(event.target.value).toDateString() + ".jpg";
    this.imagePath = '';
    this.databaseService.getImage(this.imageName, this.id).then((file) => {
      if (file) {
        this.imagePath = this.win.Ionic.WebView.convertFileSrc(file.nativeURL);
      }
    })
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
        (data) => { 
        this.date = data.value; 
        this.imageName = new Date(data.value).toDateString() + ".jpg";
        this.imagePath = '';
          this.databaseService.getImage(this.imageName, this.id).then((file) => {
            if (file) {
              this.imagePath = this.win.Ionic.WebView.convertFileSrc(file.nativeURL);
            }
          })
      }
        
      ).catch(()=>{
        this.imageName = new Date().toDateString() + ".jpg";
        this.databaseService.getImage(this.imageName, this.id).then((file) => {
          if (file) {
            this.imagePath = this.win.Ionic.WebView.convertFileSrc(file.nativeURL);
          }
        })
      });
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

  pickImage() {
    if(!this.date){
      alert("Add Date First!");
      return;
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
      if(this.imagePath){
        this.imagePath = '';
        this.databaseService.changeImage(tempBaseFilesystemPath, tempFilename, this.imageName, this.id).then((url) => {
          this.imagePath = this.win.Ionic.WebView.convertFileSrc(imageLink);
        });
      }else{
        this.databaseService.saveImage(tempBaseFilesystemPath, tempFilename, this.imageName, this.id).then((url) => {
          this.imagePath = this.win.Ionic.WebView.convertFileSrc(url);
        });
      }
     


    }, (err) => {
      // Handle error
    });
  }

  showImage(ImagePath) {
    var copyPath = ImagePath;
    var splitPath = copyPath.split('/');
    var imageName = splitPath[splitPath.length - 1];
    var filePath = ImagePath.split(imageName)[0];

    this.file.readAsDataURL(filePath, imageName).then(base64 => {
      this.imagePath = base64;
    }, error => {
      alert('Error in showing image' + error);
    });
  }

}

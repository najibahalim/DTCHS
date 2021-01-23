import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { DatabaseService } from '../services/database.service';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ImageViewerPage } from '../image-viewer/image-viewer.page'
import {PDFUtils} from './pdftemplate';
import { PopoverController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


import { fetchAccessories, fetchPart1AParameters, fetchReportFields, fetchPart1BParameters, part2Parameters, filterDimensions } from './const';
import { AlertController } from '@ionic/angular'

import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  reportFields: any;
  pdfObj: any;
  images = ['assets/noImageAvailable.jpg', 'assets/noImageAvailable.jpg', 'assets/noImageAvailable.jpg', 'assets/noImageAvailable.jpg', 'assets/noImageAvailable.jpg', 'assets/noImageAvailable.jpg'];
  win: any = window;
  pdfData = { accessories: [], part1A: {}, part1B: {}, part2Parameters: [], fansection: 5, images: [], filterDimensions: [] };
  constructor(public alertController: AlertController, private plt: Platform,
    public loadingController: LoadingController, private file: File, private fileOpener: FileOpener, private camera: Camera, public popoverController: PopoverController) { }

  ngOnInit() {
    this.reportFields = fetchReportFields();
    this.pdfData.accessories = fetchAccessories();
    this.pdfData.part1A = fetchPart1AParameters();
    this.pdfData.part1B = fetchPart1BParameters();
    this.pdfData.part2Parameters =  part2Parameters();
    this.pdfData.filterDimensions = filterDimensions();
  }

  pickImage(id: number) {
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
      this.images[id] = this.win.Ionic.WebView.convertFileSrc(imageLink);
    }, (err) => {
      console.log(err);
      alert("Error while capturing image " +  err);
    });
  }

  async presentPopover(type: number, ev: any) {
    let imgPath = this.images[type];
    const popover = await this.popoverController.create({
      component: ImageViewerPage,
      event: ev,
      translucent: true,
      componentProps: {
        imageUrl: imgPath
      },
    });
    return await popover.present();
  }

  removeUnapplicableFanSections() {
    this.pdfData.part2Parameters.forEach((param) => {
      if (param.isSelected && !param.typesOfSections.includes(this.pdfData.fansection)) {
        param.isSelected = false;
      }
    });
  }


  async generatePdf() {
    await this.showLoader();
    this.removeUnapplicableFanSections();
    this.pdfData.images = this.images;
    console.log(this.pdfData);
    const docDefination = await PDFUtils.generatePdfObj(this.pdfData);
    this.pdfObj = await pdfMake.createPdf(docDefination);
    await this.downloadPdf();
  }

  downloadPdf() {
    return new Promise<void>((resolve, reject) => {
      if (this.plt.is('cordova')) {
        this.pdfObj.getBuffer(async (buffer) => {
          var blob = new Blob([buffer], { type: 'application/pdf' });

          // Save the PDF to th`e data Directory of our App
          let url = await this.getStoragePath("Reports");
          this.file.writeFile(url, new Date().toDateString() + '.pdf', blob, { replace: true }).then(fileEntry => {
            // Open the PDf with the correct OS tools
            this.hideLoader();
            this.fileOpener.open(url + new Date().toDateString() + '.pdf', 'application/pdf');
            resolve();

          })
        });
      } else {
        // On a browser simply use download!
        this.pdfObj.download();
      }
    });

  }


  getStoragePath(folderName) {
    let file = this.file;
    return this.file.resolveDirectoryUrl(this.file.externalRootDirectory).then(function (directoryEntry) {
      return file.getDirectory(directoryEntry, "Mekar", {
        create: true,
        exclusive: false
      }).then(function (url) {
        console.log(url);
        return file.getDirectory(url, folderName, { create: true, exclusive: false }).then(() => {
          return directoryEntry.nativeURL + "Mekar/" + folderName + "/";
        })
      });
    });
  }
  // Show the loader for infinite time
  showLoader() {
    return new Promise<void>((resolve, reject) => {
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
    return new Promise<void>((resolve, reject) => {
      this.loadingController.dismiss().then((res) => {
        console.log('Loading dismissed!', res);
        resolve();
      }).catch((error) => {
        console.log('error', error);
        resolve();
      });
    })
  }
  selectChanged(value, index, selectID,) {
    switch (selectID) {
      case 'S1':
        if (value === 'add new...') {
          this.addNew(this.pdfData.part1A, index, 'val1', 'op1');
        } else {
          this.pdfData.part1A[index].val1 = value;
        }
        break;
      case 'S2':
        if (value === 'add new...') {
          this.addNew(this.pdfData.part1A, index, 'val2', 'op2');
        } else {
          this.pdfData.part1A[index].val2 = value;
        }
        break;
      case 'S3':
        if (value === 'add new...') {
          this.addNew(this.pdfData.part1B, index, 'val1', 'op1');
        } else {
          this.pdfData.part1B[index].val1 = value;
        }
        break;
      default:
        console.log('default');
    }

  }

  async addNew(obj, index, accessor1, accessor2) {
    console.log('called');
    const inputAlert = await this.alertController.create({
      header: 'Enter new value',
      inputs: [{ type: 'text', placeholder: 'type in' }],
      buttons: [{ text: 'Cancel' }, {
        text: 'Ok', handler: (data) => {
          let customValue: string = data[0];
          if (customValue) {
            const t = obj[index][accessor2].pop();
            obj[index][accessor2].push(customValue);
            obj[index][accessor1] = customValue;
            if (t)
              obj[index][accessor2].push(t);
          };
        }
      }]
    });
    await inputAlert.present();

  }

}

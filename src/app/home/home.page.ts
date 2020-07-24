import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { DatabaseService } from '../services/database.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import {PDFUtils} from './pdftemplate'
import { LoadingController } from '@ionic/angular';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { fromEventPattern } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  letterObj = {
    to: '',
    from: '',
    text: ''
  }

  pdfObj = null;
  win: any = window;
  wings: {id: string, name: string}[];
  flats: string[];
  constructor(private data: DataService, private dbService: DatabaseService, private file: File, private fileOpener: FileOpener, private plt: Platform, private webview: WebView, public loadingController: LoadingController) {
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
  async createPdf() {
    var docDefinition = await PDFUtils.getPdfTemplate();
    var imgPath = this.win.Ionic.WebView.convertFileSrc('file:///storage/emulated/0/DTCHS/Tedy.jpg');
    await this.showLoader();
    this.pdfObj = await pdfMake.createPdf(docDefinition);
    await this.hideLoader();
    await this.downloadPdf();
    
  }

  downloadPdf() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer(async (buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });

        // Save the PDF to the data Directory of our App
        let url = await this.dbService.getStoragePath("Bills");
        console.log(url);
        this.file.writeFile(url, 'DTCHS.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(url + 'DTCHS.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }

  // Show the loader for infinite time
   showLoader() {
    return new Promise((resolve,reject) =>{
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

    this.loadingController.dismiss().then((res) => {
      console.log('Loading dismissed!', res);
    }).catch((error) => {
      console.log('error', error);
    });

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

  addMonthlyReading = () => {
    
  }
 

}

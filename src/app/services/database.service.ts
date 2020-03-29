import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import * as XLSX from 'xlsx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private url: string;
  private blob;
  constructor(private plt: Platform, private sqlite: SQLite, private file: File, private fileOpener: FileOpener, private socialSharing: SocialSharing) {
    this.plt.ready().then(() => {
     const conn = this.sqlite.create({
        name: 'DTCHS.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
          console.log("Db created!");
          this.database = db;
          this.database.executeSql('CREATE TABLE IF NOT EXISTS watermeter(id INTEGER PRIMARY KEY AUTOINCREMENT,flat TEXT,date TEXT,value TEXT, type TEXT);').then(()=>("done")).catch((err) => console.log(err));
          console.log('Table Created');
        }).catch(e=> {
          console.log(e);
        });
    });
  }

  getXlsxFileData= ()=>{
    return new Promise((resolve, reject) =>{
      this.database.executeSql('SELECT * from watermeter', []).then(async data => {
        let readings = [];
        let sheetReadings: Map<string, Object> = new Map();

        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            readings.push({
              flat: data.rows.item(i).flat,
              date: data.rows.item(i).date,
              value: data.rows.item(i).value,
              type: data.rows.item(i).type,
            });
          }
        }
        let flats = this.getExcelRows();
        flats.forEach(flat => {
          sheetReadings.set(flat, { flatNo: flat });
        });
        readings.forEach(reading => {
          let preading = sheetReadings.get(reading.flat + " " + reading.type);
          let rdate = new Date(reading.date).toLocaleDateString();
          if (!preading) {
            preading = {};
          }
          preading[rdate] = Number(reading.value);
          sheetReadings.set(reading.flat + " " + reading.type, preading);
        });

        resolve(Array.from(sheetReadings.values()));
    });
    });
  }

  getXlsxFile = async () => {
    let excelJSON = await this.getXlsxFileData();
    await this.saveFile(excelJSON);
    this.fileOpener.open(this.url, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error opening file', e));
  }

  shareXlsxFile = async () => {
    let excelJSON = await this.getXlsxFileData();
    await this.saveFile(excelJSON);
    await this.socialSharing.share("Message","Subject",this.url,"url");
    
  }

  getStoragePath() {
    let file = this.file;
    return this.file.resolveDirectoryUrl(this.file.externalRootDirectory).then(function (directoryEntry) {
      return file.getDirectory(directoryEntry, "DTCHS", {
        create: true,
        exclusive: false
      }).then(function (url) {
        console.log(url);
        return file.getDirectory(url, "Reports", { create: true, exclusive: false }).then(() => {
          return directoryEntry.nativeURL + "DTCHS/" + "Reports" + "/";
        })
      });
    });
  }

  getImageStoragePath(flatId) {
    let file = this.file;
    return this.file.resolveDirectoryUrl(this.file.externalRootDirectory).then(function (directoryEntry) {
      return file.getDirectory(directoryEntry, "DTCHS", {
        create: true,
        exclusive: false
      }).then(function (url) {
        return file.getDirectory(url, "Images", { create: true, exclusive: false }).then((lastUrl) => {
          return file.getDirectory(lastUrl, flatId, { create: true, exclusive: false }).then((directoryObj)=>{
           return directoryObj;
          })
         
        })

      });
    });
  }

  saveFile = (data) => {
    return new Promise((resolve,reject) => {
      let sheet = XLSX.utils.json_to_sheet(data);
      let sheetName = "" + new Date().toDateString()
      let wb = {
        SheetNames: [sheetName],
        Sheets: {
        }
      };
      wb.Sheets[sheetName] = sheet;

      let wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary'
      });

      function s2ab(s) {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }

      let blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
      let self = this;
      this.blob = blob;
      this.getStoragePath().then(function (url) {
        let fileName = new Date().toDateString() + ".xlsx"
        self.url = url + fileName;
        self.file.writeFile(url,fileName, blob, { replace: true }).then(() => {
          console.log("File saved in folder DTCHS");
          resolve();
        }).catch((err) => {
          console.log(err);
          alert("error creating file at :" + url);
          reject();
        });
      });
    });
    
  }

  getExcelRows = () => {
    let wings = ["A", "B", "C"];
    let flats = [];
    for(let i=0; i<3;i++)
    {
      let wing = wings[i];
      flats.push(wing + "-G01 Toilet");
      flats.push(wing + "-G01 Kitchen");
      flats.push(wing + "-G02 Toilet");
      flats.push(wing + "-G02 Kitchen");
      flats.push(wing + "-G03 Toilet");
      flats.push(wing + "-G03 Kitchen");
      flats.push(wing + "-G04 Toilet");
      flats.push(wing + "-G04 Kitchen");
      for (let i = 1; i <= 7; i++) {
        flats.push(wing + "-" + i + "01 Toilet");
        flats.push(wing + "-" + i + "01 Kitchen");
        flats.push(wing + "-" + i + "02 Toilet");
        flats.push(wing + "-" + i + "02 Kitchen");
        flats.push(wing + "-" + i + "03 Toilet");
        flats.push(wing + "-" + i + "03 Kitchen");
        flats.push(wing + "-" + i + "04 Toilet");
        flats.push(wing + "-" + i + "04 Kitchen");

      }

    }
    return flats;
    
   
  }

  getEntries(flat): Promise<any> {
    return this.database.executeSql('SELECT * FROM watermeter WHERE flat = ?', [flat]).then(data => {
      let readings:Map<string, object> = new Map();
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          let dateStr = new Date(data.rows.item(i).date).toLocaleDateString();
          let curReading;
          if(readings.has(dateStr))
          {
            curReading = readings.get(dateStr);
          }
          else{
            curReading = {date:dateStr, values : []};
          }
          curReading.values.push({
            type: data.rows.item(i).type,
            value: data.rows.item(i).value
          });
          readings.set(dateStr,curReading);
        }
      }
      return Array.from(readings.values());
    });
  }
  addEntry(date, value, type, flat) {
    let data = [flat, date, value, type];
    return this.database.executeSql('INSERT INTO watermeter (flat, date, value, type) VALUES (?, ?, ?, ?)', data).then(data => {
      console.log("Data added for flat" + flat);
    });
  }

  async saveImage(fromPath, fromName, toName, flatId){
    try{
      let toPath = await (await this.getImageStoragePath(flatId.replace("-","_"))).nativeURL;
      let resp = await this.file.copyFile(fromPath, fromName, toPath, toName);
      return resp.nativeURL;
    }catch(err){
      console.log(err);
    }
      
  }

  async changeImage(fromPath, fromName, toName, flatId){
    try {
      let toPath = await (await this.getImageStoragePath(flatId.replace("-", "_"))).nativeURL;
      await this.file.removeFile(toPath, toName);
      let resp = await this.file.copyFile(fromPath, fromName, toPath, toName);
      return resp.nativeURL;
    } catch (err) {
      console.log(err);
    }
  }

  async getImage(fileName, flatId){
    try{
      const pathObj = await this.getImageStoragePath(flatId.replace("-", "_"));
      const fileRes = await this.file.getFile(pathObj,fileName,{create:false});
      // let u1 = await this.file.readAsDataURL(pathObj.nativeURL, fileName);
      // console.log(u1);
      return fileRes;

    }catch{
      console.log("FIle Not Found");
       return "";
    }
  }
}

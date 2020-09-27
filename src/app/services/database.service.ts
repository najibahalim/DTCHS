import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import * as XLSX from 'xlsx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public database: SQLiteObject;
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
        this.database.executeSql('CREATE TABLE IF NOT EXISTS watermeter(id INTEGER PRIMARY KEY AUTOINCREMENT,flat TEXT,date TEXT,value TEXT, type TEXT);').then(() => ("done")).catch((err) => console.log(err));
        console.log('Table Created');
      }).catch(e => {
        console.log(e);
      });
    });
  }

  dataAddedCount(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.database.executeSql(`SELECT date from watermeter`,[]).then(data => {
          const dateMap = {};
          const count = data.rows.length;
          for(let i=0; i< count; i++) {
            const currCount = dateMap[data.rows.item(i).date] || 0;
            dateMap[data.rows.item(i).date] = currCount + 1;
          } 
          resolve(dateMap);
        }).catch(err => {
          debugger;
          console.log(err);
          resolve();
        });

    });
  }


  getSectionTicks(date: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.database.executeSql(`SELECT flat, type from watermeter WHERE  date = ?`,
        [date]).then(data => {
          const rows = [];
          for (let index = 0; index < data.rows.length; index++) {
            const currRow = data.rows.item(index);
            rows.push(currRow.flat + currRow.type.charAt(0));
          }
          resolve(rows);
        }).catch(err => {
          console.log(err);
          resolve();
        });

    });
  }

  getTicks(date: string, flats, type): Promise<any> {


      return new Promise((resolve, reject) => {
        this.database.executeSql(`SELECT flat from watermeter WHERE  date = ? AND 
        flat IN ("${flats.join('", "')}") and type = ?`,
          [date, type]).then(data => {
          const rows = [];
            for(let index = 0; index < data.rows.length; index++){
              rows.push(data.rows.item(index));
            }
          resolve(rows);
        }).catch(err => {
          console.log(err);
          resolve();
        });
       
      });
     

  }

  //gets data from db for generating bill
  getBillData = (currentMonth, prevMonth, noOfTankers, slab3Cost, costPerTanker = 1000) => {
    return new Promise((resolve, reject) => {
      let c_Date = new Date(currentMonth).toString();
      let p_Date = new Date(prevMonth).toString();
      this.database.executeSql('SELECT * from watermeter where date = ? OR date = ?', [c_Date, p_Date]).then(async data => {
        let readings = [];
        let dbReadings: Map<string, Object> = new Map();
        let flats = this.getAllFlats();
        flats.forEach(flat => {
          dbReadings.set(flat, { flat: flat });
        });
        //extract all database data and create a JSON
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            let reading = data.rows.item(i);
            let freading: any = dbReadings.get(reading.flat);
            if (freading) {
              if (reading.date === c_Date) {
                if (reading.type === "Kitchen") {
                  freading.rck = reading.value;
                } else {
                  freading.rct = reading.value;
                }
              } else {
                if (reading.type === "Kitchen") {
                  freading.rpk = reading.value;
                } else {
                  freading.rpt = reading.value;
                }
              }
              dbReadings.set(reading.flat, freading);
            }


          }
        }
        let totalKitchen = 0;
        let totalToilet = 0;
        //Clean the JSON, validate and calculate totals
        let pdfReadings = Array.from(dbReadings.values());
        pdfReadings.forEach((pdfreading: any) => {
          if (!pdfreading.rck || !pdfreading.rct) {
            resolve({ error: `Missing Data for Flat ${pdfreading.flat}` });
          }
          pdfreading.rpk = pdfreading.rpk || 0;
          pdfreading.rpt = pdfreading.rpt || 0;

          pdfreading.netk = pdfreading.rck - pdfreading.rpk;
          pdfreading.nett = pdfreading.rct - pdfreading.rpt;
          if (pdfreading.netk < 0) {
            resolve({ error: `Previous Kitchen reading of Flat ${pdfreading.flat} is greater than current reading` });
          }
          if (pdfreading.nett < 0) {
            resolve({ error: `Previous Toilet reading of Flat ${pdfreading.flat} is greater than current reading` });
          }
          totalKitchen += pdfreading.netk;
          totalToilet += pdfreading.nett;
          pdfreading.totalReading = pdfreading.netk + pdfreading.nett;
          let dObj = new Date(c_Date);
          pdfreading.img1 = 'http://localhost/_app_file_/storage/emulated/0/DTCHS/Images/' + pdfreading.flat.replace("-", "_") + '/' + dObj.getFullYear() + '-' + (dObj.getMonth()+1) + '-1K.jpg';
          pdfreading.img2 = 'http://localhost/_app_file_/storage/emulated/0/DTCHS/Images/' + pdfreading.flat.replace("-", "_") + '/' + dObj.getFullYear() + '-' + (dObj.getMonth() + 1) + '-1T.jpg';

        });
        let slab1, slab2;
        let totalWaterConsumed = totalToilet + totalKitchen;
        let totalTankerWater = noOfTankers * 10000;
        slab1 = (totalWaterConsumed - totalTankerWater) / 96;
        slab1 = Math.ceil(slab1);
        slab2 = this.calculateSlab2(slab1, pdfReadings, noOfTankers * costPerTanker, totalWaterConsumed, slab3Cost);
        slab2 = Math.round(slab2);
        resolve({
          slab1: slab1,
          slab2: slab2,
          flatbill: pdfReadings
        });
      });

    });
  }

  calculateSlab2 = (slab1, readings, goal, totalWaterConsumed, slab3Cost) => {

    let low = slab1;
    let high = totalWaterConsumed;
    let slab3Total = 0;
    let mid;
    while (low < high) {
      mid = low + (high - low) / 2;
      slab3Total = 0;
      readings.forEach(reading => {
        if (reading.totalReading > mid) {
          slab3Total += (reading.totalReading - mid) * slab3Cost;
        }
      });
      if (slab3Total < goal) {
        high = mid;
      } else if (Math.abs(slab3Total - goal) < 0.5) {
        break;
      }
      else {
        low = mid;
      }
    }
    return mid;
  }



  getXlsxFileData = () => {
    return new Promise((resolve, reject) => {
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
            preading = { flatNo: reading.flat + " " + reading.type };
          }
          preading[rdate] = Number(reading.value);
          sheetReadings.set(reading.flat + " " + reading.type, preading);
        });

        resolve(Array.from(sheetReadings.values()));
      });
    });
  }

  getAllFlats = () => {
    let wings = ["A", "B", "C"];
    let flats = [];
    for (let i = 0; i < 3; i++) {
      let wing = wings[i];
      flats.push(wing + "-G01");
      flats.push(wing + "-G02");
      flats.push(wing + "-G03");
      flats.push(wing + "-G04");
      for (let i = 1; i <= 7; i++) {
        flats.push(wing + "-" + i + "01");
        flats.push(wing + "-" + i + "02");
        flats.push(wing + "-" + i + "03");
        flats.push(wing + "-" + i + "04");

      }

    }
    return flats;


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
    await this.socialSharing.share("Message", "Subject", this.url, "url");

  }

  getStoragePath(folderName) {
    let file = this.file;
    return this.file.resolveDirectoryUrl(this.file.externalRootDirectory).then(function (directoryEntry) {
      return file.getDirectory(directoryEntry, "DTCHS", {
        create: true,
        exclusive: false
      }).then(function (url) {
        console.log(url);
        return file.getDirectory(url, folderName, { create: true, exclusive: false }).then(() => {
          return directoryEntry.nativeURL + "DTCHS/" + folderName + "/";
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
          return file.getDirectory(lastUrl, flatId, { create: true, exclusive: false }).then((directoryObj) => {
            return directoryObj;
          })

        })

      });
    });
  }

  saveFile = (data, name="", open="") => {
    return new Promise((resolve, reject) => {
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
      this.getStoragePath("Reports").then(function (url) {
        let fileName = new Date().toDateString() + ".xlsx"
        if(name) {
          fileName = name + "_" + fileName;
        }
        self.url = url + fileName;
        self.file.writeFile(url, fileName, blob, { replace: true }).then(() => {
          console.log("File saved in folder DTCHS");
          if(open!=""){
            self.fileOpener.open(self.url, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
              .then(() => {console.log('File is opened'); resolve()})
              .catch(e => console.log('Error opening file', e));
          }
          else resolve();
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
    for (let i = 0; i < 3; i++) {
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
    flats.push("SOC-- 1");
    flats.push("SOC-- 2");
    return flats;


  }


  getEntries(flat): Promise<any> {
    return this.database.executeSql('SELECT * FROM watermeter WHERE flat = ?', [flat]).then(data => {
      let readings: Map<string, object> = new Map();
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          let dateStr = new Date(data.rows.item(i).date).toLocaleDateString();
          let curReading;
          if (readings.has(dateStr)) {
            curReading = readings.get(dateStr);
          }
          else {
            curReading = { date: dateStr, values: [] };
          }
          curReading.values.push({
            type: data.rows.item(i).type,
            value: data.rows.item(i).value
          });
          readings.set(dateStr, curReading);
        }
      }
      return Array.from(readings.values());
    });
  }
  addEntry(date, value, type, flat) {
    //check if entry exists. If yes then update it. else add
    debugger;
    this.database.executeSql('SELECT * from watermeter where flat = ? and date = ? and type = ?', [flat, date, type]).then(data => {
      console.log('Found!');
      console.log(data)
      if (data.rows.length > 0) {
        //update
        return this.database.executeSql(`UPDATE  watermeter set value = ${value} where flat=? and date=? and type = ?`, [flat, date, type]).then(data => {
          console.log("Data updated for flat" + flat);
        });
      } else {
        //create
        let data = [flat, date, value, type];
        return this.database.executeSql('INSERT INTO watermeter (flat, date, value, type) VALUES (?, ?, ?, ?)', data).then(data => {
          console.log("Data added for flat" + flat);
        });
      }
    }).catch(err => {
      console.log(err);
    })

  }

  async saveImage(fromPath, fromName, toName, flatId) {
    try {
      let toPath = await (await this.getImageStoragePath(flatId.replace("-", "_"))).nativeURL;
      let resp = await this.file.copyFile(fromPath, fromName, toPath, toName);
      return resp.nativeURL;
    } catch (err) {
      console.log(err);
    }

  }

  async changeImage(fromPath, fromName, toName, flatId) {
    try {
      let toPath = await (await this.getImageStoragePath(flatId.replace("-", "_"))).nativeURL;
      await this.file.removeFile(toPath, toName);
      let resp = await this.file.copyFile(fromPath, fromName, toPath, toName);
      return resp.nativeURL;
    } catch (err) {
      console.log(err);
    }
  }

  async getImage(fileName, flatId) {
    try {
      const pathObj = await this.getImageStoragePath(flatId.replace("-", "_"));
      const fileRes = await this.file.getFile(pathObj, fileName, { create: false });
      // let u1 = await this.file.readAsDataURL(pathObj.nativeURL, fileName);
      // console.log(u1);
      return fileRes;

    } catch{
      console.log("FIle Not Found");
      return "";
    }
  }

  async checkImage(fileName, flatId) {
    try{
    flatId = flatId.replace("-", "_");
    const fileDir = 'file:///storage/emulated/0/DTCHS/Images/'+ flatId + '/';
    const fileRes = await this.file.checkFile(fileDir, fileName);
    return true;
    } catch(err){
      return false;
    }
  }
}

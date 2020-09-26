import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

export const flats = ["A-G02K", "A-101K", "A-201K", "A-301K", "A-401K", "A-501K", "A-601K", "A-701K", "A-G02T", "A-101T", "A-201T", "A-301T", "A-401T", "A-501T", "A-601T", "A-701T", "A-G03K", "A-102K", "A-202K", "A-302K", "A-402K", "A-502K", "A-602K", "A-702K", "SOC--2", "A-G03T", "A-102T", "A-202T", "A-302T", "A-402T", "A-502T", "A-602T", "A-702T", "A-G04K", "A-103K", "A-203K", "A-303K", "A-403K", "A-503K", "A-603K", "A-703K", "A-G04T", "A-103T", "A-203T", "A-303T", "A-403T", "A-503T", "A-603T", "A-703T", "A-G01K", "A-104K", "A-204K", "A-304K", "A-404K", "A-504K", "A-604K", "A-704K", "A-G01T", "A-104T", "A-204T", "A-304T", "A-404T", "A-504T", "A-604T", "A-704T", "B-G01K", "B-101K", "B-201K", "B-301K", "B-401K", "B-501K", "B-601K", "B-701K", "B-G01T", "B-101T", "B-201T", "B-301T", "B-401T", "B-501T", "B-601T", "B-701T", "SOC--1", "B-G04K", "B-102K", "B-202K", "B-302K", "B-402K", "B-502K", "B-602K", "B-702K", "B-G04T", "B-102T", "B-202T", "B-302T", "B-402T", "B-502T", "B-602T", "B-702T", "B-G03K", "B-103K", "B-203K", "B-303K", "B-403K", "B-503K", "B-603K", "B-703K", "B-G03T", "B-103T", "B-203T", "B-303T", "B-403T", "B-503T", "B-603T", "B-703T", "B-G02K", "B-104K", "B-204K", "B-304K", "B-404K", "B-504K", "B-604K", "B-704K", "B-G02T", "B-104T", "B-204T", "B-304T", "B-404T", "B-504T", "B-604T", "B-704T", "C-G02K", "C-101K", "C-201K", "C-301K", "C-401K", "C-501K", "C-601K", "C-701K", "C-G02T", "C-101T", "C-201T", "C-301T", "C-401T", "C-501T", "C-601T", "C-701T", "C-G03K", "C-102K", "C-202K", "C-302K", "C-402K", "C-502K", "C-602K", "C-702K", "C-G03T", "C-102T", "C-202T", "C-302T", "C-402T", "C-502T", "C-602T", "C-702T", "C-G04K", "C-103K", "C-203K", "C-303K", "C-403K", "C-503K", "C-603K", "C-703K", "C-G04T", "C-103T", "C-203T", "C-303T", "C-403T", "C-503T", "C-603T", "C-703T", "C-G01K", "C-104K", "C-204K", "C-304K", "C-404K", "C-504K", "C-604K", "C-704K", "C-G01T", "C-104T", "C-204T", "C-304T", "C-404T", "C-504T", "C-604T", "C-704T"
];
@Injectable({
  providedIn: 'root'
})
export class AddReadingDataService {
 
  private billingSections = [
    {
      name: "A-1K",
      flats: ["A-G02K", "A-101K", "A-201K", "A-301K", "A-401K", "A-501K", "A-601K", "A-701K"],
      count: 8
    },
    {
      name: "A-1T",
      count: 8,
      flats: ["A-G02T", "A-101T", "A-201T", "A-301T", "A-401T", "A-501T", "A-601T", "A-701T"]
    },
    {
      count: 9,
      name: "A-2K",
      flats: ["A-G03K", "A-102K", "A-202K", "A-302K", "A-402K", "A-502K", "A-602K", "A-702K", "SOC--2"]
    },
    {
      count: 8,
      name: "A-2T",
      flats: ["A-G03T", "A-102T", "A-202T", "A-302T", "A-402T", "A-502T", "A-602T", "A-702T"]
    },
    {
      count: 8,
      name: "A-3K",
      flats: ["A-G04K", "A-103K", "A-203K", "A-303K", "A-403K", "A-503K", "A-603K", "A-703K"]
    },
    {
      count: 8,
      name: "A-3T",
      flats: ["A-G04T", "A-103T", "A-203T", "A-303T", "A-403T", "A-503T", "A-603T", "A-703T"]
    },
    {
      count: 8,
      name: "A-4K",
      flats: ["A-G01K", "A-104K", "A-204K", "A-304K", "A-404K", "A-504K", "A-604K", "A-704K"]
    },
    {
      count: 8,
      name: "A-4T",
      flats: ["A-G01T", "A-104T", "A-204T", "A-304T", "A-404T", "A-504T", "A-604T", "A-704T"]
    },
    {
      count: 8,
      name: "B-1K",
      flats: ["B-G01K", "B-101K", "B-201K", "B-301K", "B-401K", "B-501K", "B-601K", "B-701K"]
    },
    {
      count: 9,
      name: "B-1T",
      flats: ["B-G01T", "B-101T", "B-201T", "B-301T", "B-401T", "B-501T", "B-601T", "B-701T", "SOC--1"]
    },
    {
      count: 8,
      name: "B-2K",
      flats: ["B-G04K", "B-102K", "B-202K", "B-302K", "B-402K", "B-502K", "B-602K", "B-702K"]
    },
    {
      count: 8,
      name: "B-2T",
      flats: ["B-G04T", "B-102T", "B-202T", "B-302T", "B-402T", "B-502T", "B-602T", "B-702T"]
    },
    {
      count: 8,
      name: "B-3K",
      flats: ["B-G03K", "B-103K", "B-203K", "B-303K", "B-403K", "B-503K", "B-603K", "B-703K"]
    },
    {
      count: 8,
      name: "B-3T",
      flats: ["B-G03T", "B-103T", "B-203T", "B-303T", "B-403T", "B-503T", "B-603T", "B-703T"]
    },
    {
      count: 8,
      name: "B-4K",
      flats: ["B-G02K", "B-104K", "B-204K", "B-304K", "B-404K", "B-504K", "B-604K", "B-704K"]
    },
    {
      count: 8,
      name: "B-4T",
      flats: ["B-G02T", "B-104T", "B-204T", "B-304T", "B-404T", "B-504T", "B-604T", "B-704T"]
    }, {
      count: 8,
      name: "C-1K",
      flats: ["C-G02K", "C-101K", "C-201K", "C-301K", "C-401K", "C-501K", "C-601K", "C-701K"]
    },
    {
      count: 8,
      name: "C-1T",
      flats: ["C-G02T", "C-101T", "C-201T", "C-301T", "C-401T", "C-501T", "C-601T", "C-701T"]
    },
    {
      count: 8,
      name: "C-2K",
      flats: ["C-G03K", "C-102K", "C-202K", "C-302K", "C-402K", "C-502K", "C-602K", "C-702K"]
    },
    {
      count: 8,
      name: "C-2T",
      flats: ["C-G03T", "C-102T", "C-202T", "C-302T", "C-402T", "C-502T", "C-602T", "C-702T"]
    },
    {
      count: 8,
      name: "C-3K",
      flats: ["C-G04K", "C-103K", "C-203K", "C-303K", "C-403K", "C-503K", "C-603K", "C-703K"]
    },
    {
      count: 8,
      name: "C-3T",
      flats: ["C-G04T", "C-103T", "C-203T", "C-303T", "C-403T", "C-503T", "C-603T", "C-703T"]
    },
    {
      count: 8,
      name: "C-4K",
      flats: ["C-G01K", "C-104K", "C-204K", "C-304K", "C-404K", "C-504K", "C-604K", "C-704K"]
    },
    {
      count: 8,
      name: "C-4T",
      flats: ["C-G01T", "C-104T", "C-204T", "C-304T", "C-404T", "C-504T", "C-604T", "C-704T"]
    },

  ]
  private minDate = new Date(2020, 2, 1);
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
        this.database.executeSql('CREATE TABLE IF NOT EXISTS watermeter(id INTEGER PRIMARY KEY AUTOINCREMENT,flat TEXT,date TEXT,value TEXT, type TEXT);').then(() => ("done")).catch((err) => console.log(err));
        console.log('Table Created');
      }).catch(e => {
        console.log(e);
      });
    });
  }

  getMonths(): any {
    let months = [];
    let dates = [];
    let date = this.minDate;
    let currentDate = new Date();
    while (date.getMonth() != currentDate.getMonth() || date.getFullYear() != currentDate.getFullYear()){
      months.push(date.toLocaleString('default', { month: 'long' }) + ' ' + date.getFullYear());
      dates.push(date.getTime());
      date.setMonth(date.getMonth() + 1);
    
    }
    months.push(date.toLocaleString('default', { month: 'long' }) + ' ' + date.getFullYear());
    dates.push(date.getTime());
    return {months,dates};
  }

  getFlatsBySection(): any{
    return this.billingSections;
  }

  
}

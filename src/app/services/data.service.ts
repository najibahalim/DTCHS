import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';


export interface Reading {
  type: ReadingType;
  date: Date;
  value: number;  
}


export class Flat {
  id: string;
  name: string;
  waterReading: Reading[];
  wing: Wing;
  no: number;
  floor: number;

  constructor(wing:Wing, floor: number, no: number) {
    this.name = wing + "-" + floor + no;
    this.id = this.name;
    this.wing = wing;
    this.no = no;
    this.floor = floor;
  }


}

export enum Wing {
  A,
  B,
  C
}
export enum ReadingType {
  Toilet,
  Kitchen
}
@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  
  constructor() { }

  getNextFlat(flatid: string) {
    //Returns the next flat url in series
    let nextFlatId = "";
    
    if(flatid[4] === "4") {
      nextFlatId += "10";
      if(flatid[2] === "7") {
        nextFlatId += "G-";
        if(nextFlatId[0]==="C") {
          return "home";
        } else {
          nextFlatId += String.fromCharCode(flatid.charCodeAt(0) + 1)
        }
      }
      else{
        if(flatid[2] === "G")
        {
          nextFlatId += 1;
        } else {
          nextFlatId += Number(flatid[2]) + 1;
        }
        nextFlatId += "-" + flatid[0];
      }
      nextFlatId = nextFlatId.split("").reverse().join("");
    } else {
      nextFlatId = flatid.substr(0, 4);
      nextFlatId += Number(flatid[4]) + 1;
    }
    return '/message/' + nextFlatId;

  }

  public getMessages(): string[] {
    return ["a","b"];
  }

  public getMessageById(id: number): string {
    return "this.messages[id]";
  }
}

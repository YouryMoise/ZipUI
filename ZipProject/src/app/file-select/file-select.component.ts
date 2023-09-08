import { Component, Input, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import { read, utils, write, writeFile } from 'xlsx';
import {saveAs} from "file-saver"
//import { FileReader } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom, take } from 'rxjs';
//import {google} from "googleapis";


@Component({
  selector: 'app-file-select',
  templateUrl: './file-select.component.html',
  styleUrls: ['./file-select.component.scss']
})
export class FileSelectComponent implements OnInit{
  constructor(private http:HttpClient){}
  ngOnInit() {
    //this.createExcelFile();
    
    if(this.functionName == 'Counter'){
    this.count()
    }
    if(this.functionName == 'Converter'){
     //read the first column for zip codes 
      //this.createExcelFile()
      this.convert()
    }
    
  }

  

@Input() fileJSON: any;
@Input() chosenFunction: any;
@Input() fileName:string | undefined;
@Input() functionName:string | undefined;

@Output() sendValue = new EventEmitter<any>();

async createExcelFile(allZipCodes:string[], dictionary:Map<string, Map<string, number>>):Promise<any>{
  var wb = utils.book_new();
    wb.Props = {
      Title: "SheetJS Tutorial",
      Subject: "Test",
      Author: "Red Stapler",
      CreatedDate: new Date(2017,12,19)
};
  wb.SheetNames.push("Test Sheet"); 
  //var ws_data = [['hello' , 'world']]; one row with 2 cells
  var ws_data = [[" ","Latitude", "Longitude",...this.all_tags]];  
  //part to add the other rows
  //console.log(dictionary.get("Piggy")?.get("33162"))
  for(let i = 0; i<allZipCodes.length;i++){
  let temp = []
  temp.push(allZipCodes[i])

    for(let j = 0; j<this.all_tags.length;j++){
      if(dictionary.get(this.all_tags[j])?.get(allZipCodes[i])){
    temp.push(dictionary.get(this.all_tags[j])?.get(allZipCodes[i]))
    }
    else{
      temp.push(0)
    }
  }
    if(temp != undefined && temp.length > 1){
    ws_data.push(temp as string[])
    }
}

for(let k = 1; k<ws_data.length;k++){
  /* (await firstValueFrom(this.http.get<Observable<any>>(
    `https://maps.googleapis.com/maps/api/geocode/json?components=country:US|postal_code:${ws_data[k][0]}&key=AIzaSyDmVrgNrMs_hq6tXpXkiqFYb1LRSf9gdxs`
  ))).subscribe(
    (data) => {
      let result = data as unknown as Result
      ws_data[k].splice(1,0,`${result.results[0].geometry.location.lat} ${result.results[0].geometry.location.lng}`)
      //temp.push(result.results[0].address_components[0].long_name)
      ////console.log(result.results[0].geometry.location.lat)
      //console.log(result.results[0].geometry.location.lng)

    }
      ) */
      console.log("in here")
      console.log(ws_data[k])
     let temp2:any = await firstValueFrom(this.http.get<Observable<Result>>(
        `https://maps.googleapis.com/maps/api/geocode/json?components=country:US|postal_code:${ws_data[k][0]}&key=AIzaSyDmVrgNrMs_hq6tXpXkiqFYb1LRSf9gdxs`
      ))
      ////console.log("5pm")
      //if(k == ws_data.length-1) {
    ////console.log(temp2.results[0].geometry.location)
    ////console.log(temp2) 
    if (temp2.status != 'ZERO_RESULTS') {
      ws_data[k].splice(1,0,`${temp2.results[0].geometry.location.lat}`)
      ws_data[k].splice(2,0,`${temp2.results[0].geometry.location.lng}`)

    }
    else{
      ws_data[k].splice(1,0, "Not found")
      ws_data[k].splice(2,0, "Not found")


    }
}

////console.log("outside loop now")

  //will need an array for each zip code
  //to make each array, will need to create [], then push
  //zip code, then push dict.get(tag).get(zip) for every tag
  var ws = utils.aoa_to_sheet(ws_data);
  wb.Sheets["Test Sheet"] = ws;
  var wbout = write(wb, {bookType:'xlsx',  type: 'binary'});
  function s2ab(s: string) { 
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;    
}

  saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), `${this.fileName}.xlsx`);

}

testFunction(mapping:any){
  this.sendValue.emit(mapping)
}

//d = new Map<string, string>();

all_tags:string[] = [
  "Piggy","Yoga","PAWS","Dirt","Lighthouse","Art","Block","Storytime","Scavenger","Smoke",
"Underliner","Colors","Com","Shen","Gratitude","Seuss","Fam","Marcus","Zumba","Cage","Cinderfit","Walk4",
"Cocktails","Not","Global","GMD","Jr","Halloween","Typoe","Bootleg","MLK","Public"
]

zipIsBad(word:string):Boolean{
/*Bad if
No Dash:
Not 5 characters
Not numeric

With Dash:
Not 5 characters before and after dash

*/

if(word.includes("-")){
  let dashIndex:number = word.indexOf("-");
  let firstPart = word.substring(0,dashIndex)
  let secondPart = word.substring(dashIndex+1)
  if(firstPart.length != 5 || secondPart.length != 5
    || Number.isNaN(Number(firstPart)) ||
     Number.isNaN(Number(secondPart)) ){
      return false
     }
     return true
}

if(Number.isNaN(Number(word)) ||
word.length != 5){
return false
}
return true
}

/* async callCountWait(){
  //console.log("In here")
  await this.callCountAsync();
  //console.log(this.d)
} */
callCountAsync(){
  return new Promise(() => this.count()
  )
}

csvExport(file:any) {
  const headings = [['Col1', 'Col2', 'Col3']];
  const wb = utils.book_new();
  const ws: any = utils.json_to_sheet ( []);
  utils.sheet_add_aoa (ws, headings);
  utils. sheet_add_json (ws, file, {
  
  origin: 'A2',
  skipHeader: true,
  });
  utils.book_append_sheet (wb, ws, 'Users');
  writeFile(wb, 'Users Report.xlsx');

  }

  async convert(){
  //need all the zip codes
  console.log(this.fileJSON)
  console.log(typeof this.fileJSON[0])
  console.log(Array(this.fileJSON[0]))
  
  for(let i = 0; i<this.fileJSON.length;i++){
    let temp2:any = await firstValueFrom(this.http.get<Observable<Result>>(
      `https://maps.googleapis.com/maps/api/geocode/json?components=country:US|postal_code:${this.fileJSON[i][' ']}&key=AIzaSyDmVrgNrMs_hq6tXpXkiqFYb1LRSf9gdxs`
    ))
    let latitude = 'NA'
      let longitude = 'NA'
    if (temp2.status != 'ZERO_RESULTS') {
    latitude = temp2.results[0].geometry.location.lat
    longitude = temp2.results[0].geometry.location.lng
    }
    
    let temp = {
      ZIP:this.fileJSON[i][' '],
      Latitude:latitude,
      Longitude:longitude,
      Piggy:this.fileJSON[i]['Piggy'],
      Yoga:this.fileJSON[i]['Yoga'],
      PAWS:this.fileJSON[i]['PAWS'],
      Dirt:this.fileJSON[i]['Dirt'],
      Lighthouse:this.fileJSON[i]['Lighthouse'],
      Art:this.fileJSON[i]['Art'],
      Block:this.fileJSON[i]['Block'],
      Storytime:this.fileJSON[i]['Storytime'],
      Scavenger:this.fileJSON[i]['Scavenger'],
      Smoke:this.fileJSON[i]['Smoke'],
  Underliner:this.fileJSON[i]['Underliner'],
  Colors:this.fileJSON[i]['Colors'],
  Com:this.fileJSON[i]['Com'],
  Shen:this.fileJSON[i]['Shen'],
  Gratitude:this.fileJSON[i]['Gratitude'],
  Seuss:this.fileJSON[i]['Seuss'],
  Fam:this.fileJSON[i]['Fam'],
  Marcus:this.fileJSON[i]['Marcus'],
  Zumba:this.fileJSON[i]['Zumba'],
  Cage:this.fileJSON[i]['Cage'],
  Cinderfit:this.fileJSON[i]['Cinderfit'],
  Walk4:this.fileJSON[i]['Walk4'],
  Cocktails:this.fileJSON[i]['Cocktails'],
  Not:this.fileJSON[i]['Not'],
  Global:this.fileJSON[i]['Global'],
  GMD:this.fileJSON[i]['GMD'],
  Jr:this.fileJSON[i]['Jr'],
  Halloween:this.fileJSON[i]['Halloween'],
  Typoe:this.fileJSON[i]['Typoe'],
  Bootleg:this.fileJSON[i]['Bootleg'],
  MLK:this.fileJSON[i]['MLK'],
  Public:this.fileJSON[i]['Public']
    }
    this.fileJSON[i] = temp
  }

  let worksheet = utils.json_to_sheet(this.fileJSON)
  let workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet)
  writeFile(workbook, `${this.fileName}.xlsx`)
  console.log(this.fileJSON)
  /* let allZipCodes:string[] = []
  for(let i =0; i<this.fileJSON.length;i++){
    if(!allZipCodes.includes(this.fileJSON[i][' '])){
    allZipCodes.push(this.fileJSON[i][' '])
    }
  }
  //need to make a dictionary from cells
  //(0 if undefined)
  let d = new Map<string, Map<string, number>>()
  let m;
  for(let j = 0;j<this.all_tags.length;j++){
    m = new Map<string, number>()
    ////console.log(this.all_tags.length)
    for(let k = 0;k<allZipCodes.length;k++){
      m.set(String(this.fileJSON[k]['ZIP']), 0)
    }
  
    d.set(this.all_tags[j], m)
  }   */
}
count(){
/*
Need to change
Right now, Zips only appear if >=1
Need the 0s as well
When starting, loop through whole file to
get all zip codes, create a list of that
and reference it in this function
(loop over that list instead of doing
  .get().get())

*/

/*
Have a list of visited tags
For every item in the JSON file
If the tag-ZIP pair is already in visited, increase by 1
Otherwise, set to 1

*/

//currently creates dictionary of dictionaries
//Tag: <ZIP:number of tag-zip occurrences>
//still need to make it skip undefined zip codes


//all the tags from the MasterList
//Piggy,Yoga,PAWS,Dirt,Lighthouse,Art,Block,Storytime,Scavenger,Smoke,
//Underliner,Colors,Com,Shen,Gratitude,Seuss,Fam,Marcus,Zumba,Cage,Cinderfit,Walk4,
//Cocktails,Not,Global,GMD,Jr,Halloween,Typoe,Bootleg,MLK,Public

let allZipCodes:string[] = [];
for(let i = 0;i<this.fileJSON.length;i++){
  if(allZipCodes.includes(String(this.fileJSON[i]['ZIP']))){
    continue
  }

  //console.log(this.fileJSON[i]['ZIP'])
  allZipCodes.push(String(this.fileJSON[i]['ZIP']))
}


//initialize everything in d here
let d = new Map<string, Map<string, number>>()
let m;
for(let j = 0;j<this.all_tags.length;j++){
  m = new Map<string, number>()
  ////console.log(this.all_tags.length)
  for(let k = 0;k<allZipCodes.length;k++){
    m.set(String(this.fileJSON[k]['ZIP']), 0)
  }

  d.set(this.all_tags[j], m)
}
////console.log(d)


let visited: any[] = []
let currentNumber:number|undefined;
let current_tag:string;

for(let i:number = 0;i<this.fileJSON.length;i++){

  ////console.log(this.fileJSON[i]['Tag'])
  if(typeof this.fileJSON[i].Tag === 'string'){
  let result = this.all_tags.filter((word)=>this.fileJSON[i]['Tag'].includes(word))
  //add a result[0] and if result.length here
  if(result.length){
  current_tag = result[0];
  currentNumber = d.get(current_tag)?.get(String(this.fileJSON[i]['ZIP']) )
  ////console.log(currentNumber)
  
  if(currentNumber !== undefined){
  d.get(current_tag)?.set(String(this.fileJSON[i]['ZIP']),currentNumber+1)
  }
  }
}


}
this.createExcelFile(allZipCodes, d)


//this.testFunction(d)

//this.csvExport(d)

}


}



interface Result{
  results: [
      {
          address_components: [
              {
                  long_name: number,
                  short_name: number,
                  types: [
                      street_number:string,
                  ]
              },
              {
                  long_name: string,
                  short_name: string,
                  types: [
                      route:string
                  ]
              },
              {
                  long_name: string,
                  short_name: string,
                  types: [
                      locality:string,
                      political:string
                  ]
              },
              {
                  long_name: string,
                  short_name: string,
                  types: string[]
              },
              {
                  long_name: string,
                  short_name: string,
                  types: string[]
              },
              {
                  long_name: string,
                  short_name: string,
                  types:string []
              },
              {
                  long_name: number,
                  short_name: number,
                  types: any[]
              }
          ],
          formatted_address: string,
          geometry: {
              location: {
                  lat: number,
                  lng: number
              },
              location_type: string,
              viewport: {
                  northeast: {
                      lat: number,
                      lng: number
                  },
                  southwest: {
                      lat: number,
                      lng: number
                  }
              }
          },
          place_id: string,
          plus_code: {
              compound_code: string,
              global_code:string
          },
          types: any[]
      }
  ],
  status:string,
}
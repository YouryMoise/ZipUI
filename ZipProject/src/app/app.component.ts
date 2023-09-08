import { Component } from '@angular/core';
import {read, utils, writeFile} from 'xlsx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ZipProject';

  /*

  ZipCounter
  Take an excel sheet with 2 key rows, the zip codes(ZIP) and
  the event(some string with a date and tag(just care about tag))
  Make an excel sheet with the tags on the left and 
  zip codes on the top, then the correct number for each zip-tag pair

  ZipConverter
  Given an excel sheet from ZipCounter(table with zip-tag pairs)
  Convert all Zip Codes to coordinates
  This may be too quick to justify being something 
  different

  Frontend
  Should have a button asking which you want to use
  Allow you to choose a file by browsing file explorer
  If you chose counter, it should ask if you want to do counter
  and converter


  */

/* async testF():{
  if(!this.fileJSON.length){
    console.log("hello")
  }
  console.log("hi")
} */


//START OF ZIP CONVERTER CODE
//need to figure out how to take files in
//just set any input vars for now

fileJSON:any[] = [];
  csvImport($event:any){
    //console.log($event.target.files);
    const files = $event.target.files;
    if(files.length){
      const file = files[0]
      const reader = new FileReader();
      reader.onload = (event:any) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;

        if (sheets.length){
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          this.fileJSON = rows;
        }
      };
      reader.readAsArrayBuffer(file)
      console.log(this.fileJSON);
    }
  }

//take input file + input sheet and make
//sure it actually exists on device

//same for output(no sheet)

//request tags and put them all in a list

//read input file/sheet

//create a dictionary of dictionaries 
//as we go
//Each outer key is a unique tag
//Each value is a dictionary
  //Each key is zip, each val is #occurences
//loop over the tags and add/update zip in 
//dict as necessary






}

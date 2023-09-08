import { Component, ViewChild } from '@angular/core';
import { read, utils } from 'xlsx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    @ViewChild("myInput") formInput!:HTMLInputElement 

  counterChosen:boolean = false;
  converterChosen:boolean = false;

  inputValue:string = ""
  chooseButtonVisible:boolean = false;
  say(word:string){
    console.log(word)
  }
  theFunction(){
    this.chooseButtonVisible = true;
  }
  setFunctionName(name:string){
    this.chosenFunction = name;
  }
  chosenFunction:string = "";


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


}

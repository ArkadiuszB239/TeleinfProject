import { Component, OnInit } from '@angular/core';
import {CodingService} from "../services/coding.service";
import {Mark} from "../models/mark";
import {ActiveCodingService} from "../services/active-coding.service";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  codingTypeCode = 'PARI';
  contentBeforeCorr: Array<Mark> = [];
  checkedContent: Array<Mark> = [];
  bitsNumber = 0;
  controlBits = 0;
  detectedErrors = 0;
  correctedErrors = 0;
  undetectedErrors = 0;


  constructor(private codingService: CodingService, private activeCoding: ActiveCodingService) { }

  ngOnInit(): void {
    this.codingService.getCheckedContent().subscribe((data: Array<Mark>) => {
      this.checkedContent = data;
      this.bitsNumber = data.length * 8;
      this.controlBits = data.length;
      this.detectedErrors = data.filter(data => !data.isCorrect).length;
      this.undetectedErrors = this.getUndetectedErrors(data);
    });
    this.activeCoding.getCodingTypeCode().subscribe(data => {
      this.codingTypeCode = data;
      this.clear();
    });
    this.codingService.getCheckedContentBeforeCorr().subscribe(data => this.contentBeforeCorr = data);
  }

  getUndetectedErrors(content: Array<Mark>): number{
    let undetectedErrors = 0;
    for (let i = 0; i < this.contentBeforeCorr.length; i++) {
      if(this.contentBeforeCorr[i].binaryCode !== content[i].binaryCode && content[i].isCorrect){
        undetectedErrors++;
      }
    }
    return undetectedErrors;
  }

  clear(): void{
    this.checkedContent = [];
    this.bitsNumber = 0;
    this.controlBits = 0;
    this.detectedErrors = 0;
    this.correctedErrors = 0;
  }
}

import { Component, OnInit } from '@angular/core';
import {CodingService} from "../services/coding.service";
import {ActiveCodingService} from "../services/active-coding.service";
import {Mark} from "../models/mark";

@Component({
  selector: 'app-reciver',
  templateUrl: './reciver.component.html',
  styleUrls: ['./reciver.component.css']
})
export class ReciverComponent implements OnInit {

  decodedText = '';
  codedContent = '';
  codedLenght = 0;
  codingTypeCode = '';
  checkedContent: Array<Mark> = [];
  constructor(private codingService: CodingService, private activeCoding: ActiveCodingService) { }

  ngOnInit(): void {
    this.codingService.getCodedContent().subscribe(data => {
      this.codedContent = data;
      this.codedLenght = data.length;
    });
    this.activeCoding.getCodingTypeCode().subscribe(data => {
      this.codingTypeCode = data;
      this.clear();
    })
    this.codingService.getCheckedContent().subscribe((data:Array<Mark>) => {
      this.checkedContent = data;

      this.decodedText = this.codingService.convertMarkArrayToText(this.checkedContent);
    });
  }

  code(): void {
    switch (this.codingTypeCode) {
      case 'PARI': {
        this.codingService.checkCorrectionEncodedContent(this.codedContent);
        break;
      }
      case 'HAMM':{
        console.log('HAMM console log!');
        break;
      }
      default: {
        throw new Error('Error while selecting coding type');
      }
    }
  }

  clear(): void{
    this.codedContent = '';
    this.checkedContent = [];
  }
}

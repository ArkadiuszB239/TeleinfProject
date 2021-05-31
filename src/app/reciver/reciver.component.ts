import {Component, OnInit} from '@angular/core';
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
  contentBeforeCorr: Array<Mark> = [];

  constructor(private codingService: CodingService, private activeCoding: ActiveCodingService) {
  }

  ngOnInit(): void {
    this.codingService.getCodedContent().subscribe(data => {
      this.codedContent = data;
      this.codedLenght = data.length;
    });
    this.activeCoding.getCodingTypeCode().subscribe(data => {
      this.codingTypeCode = data;
      this.clear();
    })
    this.codingService.getCheckedContent().subscribe((data: Array<Mark>) => {
      this.checkedContent = data;
      this.decodeBinaryContentToText();
    });
    this.codingService.getCheckedContentBeforeCorr().subscribe(data => this.contentBeforeCorr = data);
  }

  code(): void {
    switch (this.codingTypeCode) {
      case 'PARI': {
        this.codingService.checkCorrectionEncodedContent(this.codedContent);
        break;
      }
      case 'HAMM': {
        this.codingService.decodeBinaryContentCodedWithHamming(this.codedContent);
        break;
      }
      case 'CRC16':{
        this.codingService.decodeCrcWithChosedMethod(
          this.contentBeforeCorr[0].binaryCode,
          this.codedContent,
          this.codingTypeCode
        )
        break;
      }
      case 'CRC32':{
        this.codingService.decodeCrcWithChosedMethod(
          this.contentBeforeCorr[0].binaryCode,
          this.codedContent,
          this.codingTypeCode
        )
        break;
      }
      case 'CRCITU':{
        this.codingService.decodeCrcWithChosedMethod(
          this.contentBeforeCorr[0].binaryCode,
          this.codedContent,
          this.codingTypeCode
        )
        break;
      }
      case 'ATM':{
        this.codingService.decodeCrcWithChosedMethod(
          this.contentBeforeCorr[0].binaryCode,
          this.codedContent,
          this.codingTypeCode
        )
        break;
      }
      default: {
        throw new Error('Error while selecting coding type');
      }
    }
  }

  decodeBinaryContentToText(): void{
    switch (this.codingTypeCode){
      case 'PARI': {
        this.decodedText = this.codingService.convertMarkArrayToText(this.checkedContent.map(data => ({binaryCode: data.binaryCode.slice(1)})));
        break;
      }
      case 'HAMM': {
        this.decodedText = this.codingService.convertMarkArrayToText(this.checkedContent.map(data => ({binaryCode: this.removeRedundantBits(data.binaryCode)})));
        break;
      }
      case 'CRC16':{
        this.decodedText = this.codingService.convertMarkArrayToText(this.checkedContent.slice(1));
        break;
      }
      case 'CRC32':{
        this.decodedText = this.codingService.convertMarkArrayToText(this.checkedContent.slice(1));
        break;
      }
      case 'CRCITU':{
        this.decodedText = this.codingService.convertMarkArrayToText(this.checkedContent.slice(1));
        break;
      }
      case 'ATM':{
        this.decodedText = this.codingService.convertMarkArrayToText(this.checkedContent.slice(1));
        break;
      }
      default: {
        throw new Error('Error while selecting coding type');
      }
    }
  }

  createArrayOfCharsFromString(str: string): Array<string>{
    return str.split('');
  }

  removeRedundantBits(content: string): string{
    return this.codingService.removeRedundandBitsFromHammingCodedContent(content);
  }

  clear(): void {
    this.codedContent = '';
    this.checkedContent = [];
    this.decodedText = '';
  }
}

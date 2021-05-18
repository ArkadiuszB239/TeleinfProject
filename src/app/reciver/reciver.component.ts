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
  codingTypeCode = '';
  checkedContent: Array<Mark> = [];
  constructor(private codingService: CodingService, private activeCoding: ActiveCodingService) { }

  ngOnInit(): void {
    this.codingService.getCodedContent().subscribe(data => this.codedContent = data);
    this.activeCoding.getCodingTypeCode().subscribe(data => {
      this.codingTypeCode = data;
      this.clear();
    })
    this.codingService.getCheckedContent().subscribe((data:Array<Mark>) => {
      this.checkedContent = data;

      this.decodedText = this.codingService.convertMarkArrayToText(this.checkedContent);
    });
  }

  checkEncodedContent(): void {
    this.codingService.checkCorrectionEncodedContent(this.codedContent);
  }

  clear(): void{
    this.codedContent = '';
    this.checkedContent = [];
  }
}

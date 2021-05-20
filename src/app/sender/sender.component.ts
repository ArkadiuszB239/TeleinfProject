import {Component, OnInit} from '@angular/core';
import {CodingService} from "../services/coding.service";
import {ActiveCodingService} from "../services/active-coding.service";

@Component({
  selector: 'app-sender',
  templateUrl: './sender.component.html',
  styleUrls: ['./sender.component.css']
})
export class SenderComponent implements OnInit {

  codingContent = 'Test';
  binaryContent = '';
  codedContent = '';
  codingTypeCode = '';

  constructor(private codingService: CodingService, private activeCoding: ActiveCodingService) {
  }

  ngOnInit(): void {
    this.activeCoding.getCodingTypeCode().subscribe((data: string) => {
      this.codingTypeCode = data;
      this.clear();
    });
    this.codingService.getCodedContent().subscribe(data => this.codedContent = data);
  }

  code(): void {
    switch (this.codingTypeCode) {
      case 'PARI': {
        this.binaryContent = this.codingService.convertStringToBinaryArray(this.codingContent);
        this.codingService.addParityBit(this.binaryContent);
        break;
      }
      case 'HAMM':{
        this.binaryContent = this.codingService.convertStringToBinaryArray(this.codingContent);
        this.codingService.codeBinaryArrayWithHamming(this.binaryContent);
        break;
      }
      default: {
        throw new Error('Error while selecting coding type');
      }
    }
  }

  clear(): void {
    this.codingContent = 'Test';
    this.binaryContent = '';
    this.codedContent = '';
  }
}

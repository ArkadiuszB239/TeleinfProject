import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Mark} from "../models/mark";


@Injectable({
  providedIn: 'root'
})
export class CodingService {

  private codedContent = '';
  private codedContentObs = new BehaviorSubject<string>(this.codedContent);

  private checkedContentBeforeCorr: Array<Mark> = [];
  private checkedContentBeforeCorrObs = new BehaviorSubject<Array<Mark>>(this.checkedContentBeforeCorr);

  private checkedContent: Array<Mark> = [];
  private checkedContentObs = new BehaviorSubject<Array<Mark>>(this.checkedContent);

  constructor() {
  }

  convertStringToBinaryArray(content: string): string {
    return content.split('').map(data => data.charCodeAt(0).toString(2)).join(' ');
  }

  addParityBit(content: string): void {
    this.codedContent = content.split(' ')
      .map(data => this.isEven(data.split('').map(number => parseInt(number)).reduce((sum, x) => sum + x)) ?
        '0' + data
        : '1' + data
      ).join(' ');
    this.codedContentObs.next(this.codedContent);
    this.checkedContentBeforeCorrObs.next(this.codedContent.split(' ')
      .map(data => ({binaryCode: data, isCorrect: false})));
  }

  checkCorrectionEncodedContent(content: string): void {
    this.checkedContent = content.split(' ')
      .map(data => this.isEven(data.split('').map(number => parseInt(number)).reduce((sum, x) => sum + x)) ?
        ({binaryCode: data, isCorrect: true})
        : ({binaryCode: data, isCorrect: false})
      );
    this.checkedContentObs.next(this.checkedContent);
  }

  convertMarkArrayToText(content: Array<Mark>): string{
    return content.map(data => String.fromCharCode(parseInt(data.binaryCode.slice(1),2))).join('');
  }

  isEven(number: number): boolean {
    return number % 2 == 0;
  }

  getCodedContent(): Observable<string> {
    return this.codedContentObs.asObservable();
  }

  getCheckedContent(): Observable<Array<Mark>>{
    return this.checkedContentObs.asObservable();
  }

  getCheckedContentBeforeCorr(): Observable<Array<Mark>>{
    return this.checkedContentBeforeCorrObs.asObservable();
  }
}

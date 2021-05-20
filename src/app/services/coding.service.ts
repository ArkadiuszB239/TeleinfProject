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

  // parity
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

  convertMarkArrayToText(content: Array<Mark>): string {
    return content.map(data => String.fromCharCode(parseInt(data.binaryCode.slice(1), 2))).join('');
  }

  isEven(number: number): boolean {
    return number % 2 == 0;
  }

  //hamming

  codeBinaryArrayWithHamming(content: string): void {
    let binaryContentWithZeros = content.split(' ').map(content => this.insertZerosControlBits(content));
    console.log(binaryContentWithZeros);
    let onesIndexes = binaryContentWithZeros.map(content => {
      let tmp = this.reverseString(content);
      let controlBitsIndexes = '';
      for (let i = 1; i <= tmp.length; i++) {
        if (tmp.charAt(i - 1) == '1') controlBitsIndexes = controlBitsIndexes + i.toString() + ' ';
      }
      controlBitsIndexes = controlBitsIndexes.substring(0, controlBitsIndexes.length-1);
      return controlBitsIndexes;
    })
    console.log(onesIndexes);
    for (let i = 0; i < onesIndexes.length; i++) {
      let tmp = this.convertIndexesArrayToBinaryString(onesIndexes[i]).split(' ');
      let indexes = [3, 7, 9, 10];
      for (let j = 0; j < 4; j++) {
        let tmp2 = tmp.map(data => data.charAt(j))
        if(!this.isEven(tmp2.map(number => parseInt(number)).reduce((sum, x) => sum + x))){
          binaryContentWithZeros[i] = this.replaceAt(binaryContentWithZeros[i], indexes[j], '1');
        } else {
          binaryContentWithZeros[i] = this.replaceAt(binaryContentWithZeros[i], indexes[j], '0');
        }
      }
    }
    this.codedContentObs.next(binaryContentWithZeros.join(' '));
  }

  convertIndexesArrayToBinaryString(indexesArray: string): string{
    return indexesArray.split(' ').map(data => {
      let parsedData = parseInt(data).toString(2);
      if(parsedData.length < 4){
        return this.addZerosBeforeContent(parsedData, 4 - parsedData.length);
      } else {
        return parseInt(data).toString(2);
      }
    }).join(' ');
  }

  replaceAt(content: string, index: number, replacement: string): string{
    return content.substring(0, index) + replacement + content.slice(index+1);
  }

  reverseString(str: string): string {
    return str.split('').reverse().join('');
  }

  insertZerosControlBits(content: string): string {
    return content.substring(0, 3) + '0' + content.substring(3, 6) + '0' + content.charAt(6) + '00';
  }

  addZerosBeforeContent(content: string, zeros: number): string{
    let newContent = '';
    for (let i = 0; i < zeros; i++) {
      newContent = newContent + '0';
    }
    return newContent.concat(content);
  }

  getCodedContent(): Observable<string> {
    return this.codedContentObs.asObservable();
  }

  getCheckedContent(): Observable<Array<Mark>> {
    return this.checkedContentObs.asObservable();
  }

  getCheckedContentBeforeCorr(): Observable<Array<Mark>> {
    return this.checkedContentBeforeCorrObs.asObservable();
  }
}

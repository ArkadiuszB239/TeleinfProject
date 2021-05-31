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
    return content.map(data => String.fromCharCode(parseInt(data.binaryCode, 2))).join('');
  }

  isEven(number: number): boolean {
    return number % 2 == 0;
  }

  //hamming

  codeBinaryArrayWithHamming(content: string): void {
    let indexes = [3, 7, 9, 10];
    let binaryContentWithZeros = content.split(' ').map(content => this.insertZerosControlBits(content));

    let onesIndexes = this.getControlBitsIndexes(binaryContentWithZeros);

    for (let i = 0; i < onesIndexes.length; i++) {
      let tmp = this.convertIndexesArrayToBinaryString(onesIndexes[i]).split(' ');
      for (let j = 0; j < 4; j++) {
        let tmp2 = tmp.map(data => data.charAt(j));
        if (!this.isEven(tmp2.map(number => parseInt(number)).reduce((sum, x) => sum + x))) {
          binaryContentWithZeros[i] = this.replaceAt(binaryContentWithZeros[i], indexes[j], '1');
        } else {
          binaryContentWithZeros[i] = this.replaceAt(binaryContentWithZeros[i], indexes[j], '0');
        }
      }
    }
    this.codedContentObs.next(binaryContentWithZeros.join(' '));
    this.checkedContentBeforeCorrObs.next(binaryContentWithZeros.map(data => ({binaryCode: data})));
  }

  decodeBinaryContentCodedWithHamming(content: string): void {
    let binaryContent = content.split(' ');

    let onesIndexes = this.getControlBitsIndexes(binaryContent);
    for (let i = 0; i < onesIndexes.length; i++) {
      let tmp = this.convertIndexesArrayToBinaryString(onesIndexes[i]).split(' ');
      let mod2Sum = '';
      for (let j = 0; j < 4; j++) {
        let tmp2 = tmp.map(data => data.charAt(j));
        if (!this.isEven(tmp2.map(number => parseInt(number)).reduce((sum, x) => sum + x))) {
          mod2Sum = mod2Sum.concat('1');
        } else {
          mod2Sum = mod2Sum.concat('0');
        }
      }
      this.checkedContent[i] = ({
        binaryCode: binaryContent[i],
        hammingCorrectedBit: parseInt(mod2Sum, 2) == 0 ? -1 : parseInt(mod2Sum, 2) - 1
      });
    }
    console.log(this.checkedContent);
    this.checkedContentObs.next(this.checkedContent);
  }

  getControlBitsIndexes(content: Array<string>): Array<string> {
    return content.map(content => {
      let tmp = this.reverseString(content);
      let controlBitsIndexes = '';
      for (let i = 1; i <= tmp.length; i++) {
        if (tmp.charAt(i - 1) == '1') controlBitsIndexes = controlBitsIndexes + i.toString() + ' ';
      }
      controlBitsIndexes = controlBitsIndexes.substring(0, controlBitsIndexes.length - 1);
      return controlBitsIndexes;
    })
  }

  convertIndexesArrayToBinaryString(indexesArray: string): string {
    return indexesArray.split(' ').map(data => {
      let parsedData = parseInt(data).toString(2);
      if (parsedData.length < 4) {
        return this.addZerosBeforeContent(parsedData, 4 - parsedData.length);
      } else {
        return parseInt(data).toString(2);
      }
    }).join(' ');
  }

  replaceAt(content: string, index: number, replacement: string): string {
    return content.substring(0, index) + replacement + content.slice(index + 1);
  }

  reverseString(str: string): string {
    return str.split('').reverse().join('');
  }

  insertZerosControlBits(content: string): string {
    return content.substring(0, 3) + '0' + content.substring(3, 6) + '0' + content.charAt(6) + '00';
  }

  addZerosBeforeContent(content: string, zeros: number): string {
    let newContent = '';
    for (let i = 0; i < zeros; i++) {
      newContent = newContent + '0';
    }
    return newContent.concat(content);
  }

  removeRedundandBitsFromHammingCodedContent(content: string): string {
    return content.substring(0, 3) + content.substring(4, 7) + content.charAt(8);
  }

  //CRC
  encodeCrcWithRegistry(content: Array<Array<number>>, codingMethod: string, coding: boolean): string {
    let klucz: Array<number> = [];
    switch (codingMethod) {
      case 'CRC16': {
        klucz = 0x8005.toString(2).split('').map(data => parseInt(data));
        break;
      }
      case 'CRC32': {
        klucz = Array(5).fill(0).concat(0x04C11DB7.toString(2).split('').map(data => parseInt(data)));
        break;
      }
      case 'CRCITU':{
        klucz = Array(3).fill(0).concat(0x1021.toString(2).split('').map(data => parseInt(data)));
        break;
      }
      case 'ATM':{
        klucz = Array(5).fill(0).concat(0x07.toString(2).split('').map(data => parseInt(data)));
        break;
      }
      default: {
        throw new Error('Error while selecting coding type');
      }
    }

    let keylength = klucz.length;
    let rejestr = Array(keylength).fill(0);

    let lastbit;
    content.forEach(bytes => {
      for (let i = 0; i < keylength; i++) {
        rejestr[i] = rejestr[i] ^ bytes[i];
      }

      for (let i = 0; i < 8; i++) {
        lastbit = rejestr.shift();
        rejestr.push(0);
        if (lastbit != 0) {
          for (let j = 0; j < keylength; j++) {
            rejestr[j] = rejestr[j] ^ klucz[j];
          }
        }
      }
    })
    if (coding) {
      this.codedContentObs.next(rejestr.join('').concat(' '.concat(content.map(bitArray => bitArray.join('').substring(0, 8)).join(' '))));
      this.checkedContentBeforeCorrObs.next(
        rejestr.join('').concat(' '.concat(content.map(data => data.join('').substring(0, 8)).join(' '))).split(' ').map(data => ({binaryCode: data}))
      );
    } else {
      return rejestr.join('');
    }
    return '';
  }

  convertStringToArraysOfBytes(content: string, codingMethod: string): Array<Array<number>> {
    switch (codingMethod) {
      case 'CRC16': {
        return content.split('').map(data => {
          let binary = '0'.concat(data.charCodeAt(0).toString(2));
          return binary.split('').map(char => parseInt(char)).concat(Array(8).fill(0));
        });
      }
      case 'CRC32': {
        return content.split('').map(data => {
          let binary = '0'.concat(data.charCodeAt(0).toString(2));
          return binary.split('').map(char => parseInt(char)).concat(Array(24).fill(0));
        });
      }
      case 'CRCITU': {
        return content.split('').map(data => {
          let binary = '0'.concat(data.charCodeAt(0).toString(2));
          return binary.split('').map(char => parseInt(char)).concat(Array(8).fill(0));
        });
      }
      case 'ATM': {
        return content.split('').map(data => {
          let binary = '0'.concat(data.charCodeAt(0).toString(2));
          return binary.split('').map(char => parseInt(char));
        });
      }
      default: {
        throw new Error('Error while selecting coding type');
      }
    }
  }

  convertBinaryContentToArraysOfBytes(content: string, codingMethod: string): Array<Array<number>> {
    switch (codingMethod) {
      case 'CRC16': {
        return content.split(' ').map(data => data.split('').map(bit => parseInt(bit)).concat(Array(8).fill(0)));
      }
      case 'CRC32': {
        return content.split(' ').map(data => data.split('').map(bit => parseInt(bit)).concat(Array(24).fill(0)));
      }
      case 'CRCITU': {
        return content.split(' ').map(data => data.split('').map(bit => parseInt(bit)).concat(Array(8).fill(0)));
      }
      case 'ATM': {
        return content.split(' ').map(data => data.split('').map(bit => parseInt(bit)));
      }
      default: {
        throw new Error('Error while selecting coding type');
      }
    }
  }

  decodeCrcWithChosedMethod(crcFromLastCoding: string, content: string, codingMethod: string): void {
    let newCrc = '';
    switch (codingMethod) {
      case 'CRC16': {
        newCrc = this.encodeCrcWithRegistry(
          this.convertBinaryContentToArraysOfBytes(content.slice(crcFromLastCoding.length), codingMethod),
          codingMethod,
          false
        );
        this.checkedContentObs.next(
          crcFromLastCoding == newCrc && crcFromLastCoding == content.split(' ')[0] ?
            content.split(' ').map(data => ({binaryCode: data, isCorrect: true}))
            : content.split(' ').map(data => ({binaryCode: data, isCorrect: false}))
        )
        break;
      }
      case 'CRC32': {
        newCrc = this.encodeCrcWithRegistry(
          this.convertBinaryContentToArraysOfBytes(content.slice(crcFromLastCoding.length), codingMethod),
          codingMethod,
          false
        );
        this.checkedContentObs.next(
          crcFromLastCoding == newCrc && crcFromLastCoding == content.split(' ')[0] ?
            content.split(' ').map(data => ({binaryCode: data, isCorrect: true}))
            : content.split(' ').map(data => ({binaryCode: data, isCorrect: false}))
        )
        break;
      }
      case 'CRCITU': {
        newCrc = this.encodeCrcWithRegistry(
          this.convertBinaryContentToArraysOfBytes(content.slice(crcFromLastCoding.length), codingMethod),
          codingMethod,
          false
        );
        this.checkedContentObs.next(
          crcFromLastCoding == newCrc && crcFromLastCoding == content.split(' ')[0] ?
            content.split(' ').map(data => ({binaryCode: data, isCorrect: true}))
            : content.split(' ').map(data => ({binaryCode: data, isCorrect: false}))
        )
        break;
      }
      case 'ATM': {
        newCrc = this.encodeCrcWithRegistry(
          this.convertBinaryContentToArraysOfBytes(content.slice(crcFromLastCoding.length), codingMethod),
          codingMethod,
          false
        );
        this.checkedContentObs.next(
          crcFromLastCoding == newCrc && crcFromLastCoding == content.split(' ')[0] ?
            content.split(' ').map(data => ({binaryCode: data, isCorrect: true}))
            : content.split(' ').map(data => ({binaryCode: data, isCorrect: false}))
        )
        break;
      }
      default: {
        throw new Error('Error while selecting coding type');
      }
    }
  }

  //observables
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

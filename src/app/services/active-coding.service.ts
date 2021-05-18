import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ActiveCodingService {

  private codingTypeCode = 'PARI';

  codingTypeCodeObs = new BehaviorSubject<string>(this.codingTypeCode);

  constructor() { }

  setCodingTypeCode(typeCode: string): void {
    this.codingTypeCode = typeCode;
    this.codingTypeCodeObs.next(this.codingTypeCode);
  }

  getCodingTypeCode(): Observable<string> {
    return this.codingTypeCodeObs.asObservable();
  }

}

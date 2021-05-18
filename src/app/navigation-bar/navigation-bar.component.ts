import { Component, OnInit } from '@angular/core';
import {ActiveCodingService} from "../services/active-coding.service";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  public codingTypeCode = '';

  constructor(private activeCoding: ActiveCodingService) { }

  ngOnInit(): void {
    this.activeCoding.getCodingTypeCode().subscribe((data: string) => this.codingTypeCode = data);
  }

  setCodingTypeCode(typeCode: string): void {
    this.activeCoding.setCodingTypeCode(typeCode);
  }

}

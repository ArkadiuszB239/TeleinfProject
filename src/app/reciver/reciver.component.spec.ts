import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReciverComponent } from './reciver.component';

describe('ReciverComponent', () => {
  let component: ReciverComponent;
  let fixture: ComponentFixture<ReciverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReciverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReciverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

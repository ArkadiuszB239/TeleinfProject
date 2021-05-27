import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { SenderComponent } from './sender/sender.component';
import {FormsModule} from "@angular/forms";
import { ReciverComponent } from './reciver/reciver.component';
import { GetBitsPipe } from './pipes/get-bits.pipe';
import { SlicePipe } from './pipes/slice.pipe';
import { ResultsComponent } from './results/results.component';
import { GetBitsFromToPipe } from './pipes/get-bits-from-to.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    SenderComponent,
    ReciverComponent,
    GetBitsPipe,
    SlicePipe,
    ResultsComponent,
    GetBitsFromToPipe
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSignaturePadModule } from 'ngx-signature-pad';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignaturePadComponent } from './signature-pad/signature-pad.component';

@NgModule({
  declarations: [
    AppComponent,
    SignaturePadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxSignaturePadModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

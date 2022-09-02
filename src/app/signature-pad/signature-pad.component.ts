import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NgxSignatureOptions, NgxSignaturePad } from 'ngx-signature-pad';

@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss']
})
export class SignaturePadComponent implements AfterViewInit {

  options: NgxSignatureOptions = {
    penColor: 'red',
    maxWidth: 10
  }

  @ViewChild('signature1') signature1!: NgxSignaturePad;

  constructor() {
  }

  ngAfterViewInit(): void {
  }

  clear() {
    this.signature1.clear();
  }

  undo(){
    this.signature1.undo();
  }

}

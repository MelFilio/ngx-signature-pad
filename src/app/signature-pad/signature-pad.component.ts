import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NgxSignatureOptions, NgxSignaturePad } from 'ngx-signature-pad';

@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss']
})
export class SignaturePadComponent implements AfterViewInit {

  options: NgxSignatureOptions = {
    // backgroundImgUrl: 'assets/cat.jpg',
    maxWidth: 2,
    css: {
      'border-radius': '1.5em',
      'border': '.09em dashed',
    }
  }

  dataUrl!: string;

  @ViewChild('signature1') signature1!: NgxSignaturePad;

  constructor() {
  }

  ngAfterViewInit(): void {
  }

  submit() {
    console.log(this.signature1.isEmpty());
    if (!this.signature1.isEmpty())
      this.dataUrl = this.signature1.toDataURL();

  }

  clear() {
    this.signature1.clear();
  }

  undo() {
    this.signature1.undo();
  }

  random() {
    this.options = { ...this.options, penColor: 'red' };
    console.log(1);
  }

}

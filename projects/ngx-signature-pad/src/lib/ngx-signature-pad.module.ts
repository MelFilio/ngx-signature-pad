import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxSignaturePad } from './ngx-signature-pad.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ NgxSignaturePad ],
  exports: [ NgxSignaturePad ]
})
export class NgxSignaturePadModule { }

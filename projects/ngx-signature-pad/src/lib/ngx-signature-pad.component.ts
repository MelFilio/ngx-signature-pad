import {
  AfterViewInit, Component, ElementRef, EventEmitter,
  Input, OnChanges, Output, Renderer2, SimpleChanges, ViewChild
} from '@angular/core';
import SignaturePad, { PointGroup } from 'signature_pad';
import { NgxSignatureOptions } from './models/ngx-signature-pad.model';

@Component({
  selector: 'ngx-signature-pad',
  template: `
    <canvas #nspCanvas></canvas>
  `,
  styles: [
  ]
})
export class NgxSignaturePad implements AfterViewInit, OnChanges {

  @ViewChild('nspCanvas', { static: false }) nspCanvas!: ElementRef;
  private _canvas!: HTMLCanvasElement;
  private _signaturePad!: SignaturePad

  private _isEmpty = true;
  private _signDataHistory: PointGroup[] = [];

  @Input() options: NgxSignatureOptions = {};

  @Output() public beginSign = new EventEmitter<void>();
  @Output() public endSign = new EventEmitter<void>();

  constructor(private renderer2: Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'].firstChange) {
      return;
    }

  }

  ngAfterViewInit(): void {
    this.initSignaturePad()
  }

  ngOnInit(): void {
  }

  initSignaturePad() {
    this._canvas = this.nspCanvas.nativeElement;

    const { width, height, css } = this.options;
    this.options.width = width ? width : 300;
    this.options.height = height ? height : 150;
    this._canvas.width = this.options.width;
    this._canvas.height = this.options.height;

    for (const key in css) {
      if (Object.prototype.hasOwnProperty.call(css, key)) {
        const value = css[key];
        this.renderer2.setStyle(this._canvas, key, value);
      }
    }

    this._signaturePad = new SignaturePad(this._canvas, this.options);
    this._signaturePad.addEventListener("beginStroke", () => {
      this.beginStroke();
    }, { once: true, });

    this._signaturePad.addEventListener("endStroke", () => {
      this.endStroke()
    });
  }

  //#region -> EventBinder Helper
  private beginStroke(): void {
    this.setDirty(); // When user draws, set state as dirty
    this.beginSign.emit();
  }

  private endStroke(): void {
    this._signDataHistory = this._signaturePad.toData();
    this.endSign.emit();
  }
  //#endregion

  //#region -> State Helper
  setDirty() {
    this._isEmpty = false;
  }

  setEmpty() {
    this._isEmpty = true;
  }
  //#endregion

  public isEmpty() {
    return this._isEmpty;
  }

  public undo() {
    this._signDataHistory.pop();
    this._signaturePad.fromData(this._signDataHistory);
    if (this._signDataHistory.length === 0) {
      this.setEmpty();
    }
  }

  public clear(): void {
    this.setEmpty();
    this._signDataHistory = [];
    this._signaturePad.clear();
  }

  public toDataURL(type?: 'image/jpeg' | 'image/svg+xml'): string {
    switch (type) {
      case 'image/jpeg':
        return this._signaturePad.toDataURL('image/jpeg');
      case 'image/svg+xml':
        return this._signaturePad.toDataURL('image/svg+xml');
      default:
        return this._signaturePad.toDataURL();
    }
  }

}

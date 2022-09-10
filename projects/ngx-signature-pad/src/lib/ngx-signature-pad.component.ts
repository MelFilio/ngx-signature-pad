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
  styles: []
})
export class NgxSignaturePad implements AfterViewInit, OnChanges {

  @ViewChild('nspCanvas', { static: false }) nspCanvas!: ElementRef;
  private _canvas!: HTMLCanvasElement;
  private _signaturePad!: SignaturePad;

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

    const {
      dotSize,
      minWidth,
      maxWidth,
      throttle,
      minDistance,
      backgroundColor,
      penColor,
      velocityFilterWeight,
      width,
      height,
      css,
      backgroundImgUrl
    } = changes['options'].currentValue;

    if (dotSize) {
      this._signaturePad.dotSize = dotSize;
    }

    if (minWidth) {
      this._signaturePad.minWidth = minWidth;
    }

    if (maxWidth) {
      this._signaturePad.maxWidth = maxWidth;
    }

    if (throttle) {
      this._signaturePad.throttle = throttle;
    }

    if (minDistance) {
      this._signaturePad.minDistance = minDistance;
    }

    if (backgroundColor) {
      this._signaturePad.backgroundColor = backgroundColor;
    }

    if (penColor) {
      this._signaturePad.penColor = penColor;
    }

    if (velocityFilterWeight) {
      this._signaturePad.velocityFilterWeight = velocityFilterWeight;
    }

    if (width || height) {
      const { width: previousWidth, height: previousHeight } = changes['options'].previousValue;
      const data = this._canvas.toDataURL();
      const image = new Image();
      image.src = data;
      image.onload = () => {
        const ctx = this._canvas.getContext('2d');
        if (ctx)
          ctx.drawImage(image, 0, 0, previousWidth, previousHeight, 0, 0, width, height);
      };
    }

    if (css) {
      for (const key in css) {
        if (Object.prototype.hasOwnProperty.call(css, key)) {
          const value = css[key];
          this.renderer2.setStyle(this._canvas, key, value);
        }
      }
    }

    if (backgroundImgUrl) {
      this._canvas.setAttribute('style', 'background:url(' + this.options.backgroundImgUrl + '); background-size: 100%; background-repeat: no-repeat;')
    }
  }

  ngAfterViewInit(): void {
    this.initSignaturePad()
  }

  private initSignaturePad() {
    this._canvas = this.nspCanvas.nativeElement;

    this.setCommonOptions();

    //adding css does not seem to work when refactored
    const { css } = this.options;
    for (const key in css) {
      if (Object.prototype.hasOwnProperty.call(css, key)) {
        const value = css[key];
        this.renderer2.setStyle(this._canvas, key, value);
      }
    }

    this._signaturePad = new SignaturePad(this._canvas, this.options);
    this._signaturePad.addEventListener("beginStroke", () => {
      this.beginStroke();
    });

    this._signaturePad.addEventListener("endStroke", () => {
      this.endStroke()
    });
  }

  //#region -> Options Setter
  setCommonOptions() {
    this.setHeightAndWidth();
    this.setBackgroundImg();
  }

  setHeightAndWidth() {
    const { width, height } = this.options;
    this.options.width = width ? width : 300;
    this.options.height = height ? height : 150;
    this._canvas.width = this.options.width;
    this._canvas.height = this.options.height;
  }

  setBackgroundImg() {
    if (this.options.backgroundImgUrl)
      this._canvas.setAttribute('style', 'background:url(' + this.options.backgroundImgUrl + '); background-size: 100%; background-repeat: no-repeat;')
  }

  //#endregion

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
        return this._canvas.toDataURL('image/jpeg');
      case 'image/svg+xml':
        return this._canvas.toDataURL('image/svg+xml');
      default:
        return this._canvas.toDataURL();
    }
  }

}

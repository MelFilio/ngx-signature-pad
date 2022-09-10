import { Options } from "signature_pad";

export interface NgxSignatureOptions extends Options{
  backgroundImgUrl?: string;
  width?: number;
  height?: number;
  css?: { [key: string]: string };
}

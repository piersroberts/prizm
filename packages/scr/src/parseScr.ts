import Scr from "../generated/Scr";
import { KaitaiStream } from "kaitai-struct";

interface IScr {
  pixelBuffer: {
    pixels: boolean[];
  };
  attributeBuffer: {
    attributes: {
      ink: number;
      paper: number;
      bright: boolean;
      flash: boolean;
    }[];
  };
}

export function parseScr(scrData) {
  const parsedScr = new Scr(new KaitaiStream(scrData));
  return parsedScr as IScr;
}

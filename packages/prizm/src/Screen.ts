import { Font, type FontOptions } from "./Font";
import { Graphics } from "./Graphics";
import { Palette } from "./Palette";
import { Text } from "./Text";
import { Colors } from "./Colors";
import { PixelBuffer } from "./PixelBuffer";
import { AttributeBuffer } from "./AttributeBuffer";

export type ScreenOptions = {
  width: number;
  height: number;
  targetFps?: number;
  element: {
    width: number;
    height: number;
  };
  defaultPaperColor?: Palette;
  defaultInkColor?: Palette;
};

export type Direction = "abToPb" | "pbToAb" | "abToAb" | "pbToPb";

export type Coords = [x: number, y: number];

export class Screen {
  readonly elementWidth: number;
  readonly elementHeight: number;
  readonly targetFps: number = 60;
  private context: CanvasRenderingContext2D | null;
  readonly pixelBuffer: PixelBuffer;
  readonly attributeBuffer: AttributeBuffer;
  readonly palette: typeof Palette;
  readonly fonts: Map<string, Font> = new Map();
  public gfx: Graphics;
  public text: Text;
  public lastFrame = 0;
  public defaultPaperColor = Palette.WHITE;
  public defaultInkColor = Palette.BRIGHT_BLACK;
  public inkColor = this.defaultInkColor;
  public paperColor = this.defaultPaperColor;
  public loading = new Set<string>();
  private imageData: ImageData;

  constructor(canvas: HTMLCanvasElement, options: ScreenOptions) {
    if (options.targetFps) {
      this.targetFps = options.targetFps;
    }
    if (options.width % options.element.width !== 0) {
      throw new Error("Width must be divisible by element width");
    }
    if (options.height % options.element.height !== 0) {
      throw new Error("Height must be divisible by element height");
    }
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error("Unable to get canvas element");
    }
    canvas.width = options.width;
    canvas.height = options.height;
    this.context = canvas.getContext("2d");
    if (!this.context) {
      throw new Error("Unable to get 2d context");
    }

    this.defaultInkColor =
      typeof options.defaultInkColor === "number"
        ? options.defaultInkColor
        : this.defaultInkColor;
    this.defaultPaperColor =
      typeof options.defaultPaperColor === "number"
        ? options.defaultPaperColor
        : this.defaultPaperColor;
    this.elementWidth = options.element.width;
    this.elementHeight = options.element.height;

    this.palette = Palette;
    this.pixelBuffer = new PixelBuffer(options.width, options.height);
    this.attributeBuffer = new AttributeBuffer(this);
    this.text = new Text(this);
    this.gfx = new Graphics(this);

    this.imageData = this.context.createImageData(
      this.pixelBuffer.width,
      this.pixelBuffer.height,
    );
  }

  public randomizeInkPaper() {
    for (let y = 0; y < this.pixelBuffer.height / this.elementHeight; y++) {
      for (let x = 0; x < this.pixelBuffer.width / this.elementWidth; x++) {
        this.attributeBuffer[
          y * (this.pixelBuffer.width / this.elementWidth) + x
        ] = [
          Math.floor(Math.random() * Object.keys(Colors).length),
          Math.floor(Math.random() * Object.keys(Colors).length),
        ];
      }
    }
  }

  public addFont(name: string, font: Font) {
    this.fonts.set(name, font);
  }

  public loadFont(src: string, options: FontOptions) {
    this.loading.add(src);
    const image = new Image();
    image.src = src;
    image.onload = () => {
      this.loading.delete(src);
      this.addFont(options.name, new Font(image, options));
    };
    image.onerror = () => {
      throw new Error("Unable to load font");
    };
  }

  public setInkColor(color: Palette) {
    this.inkColor = color;
  }

  public setPaperColor(color: Palette) {
    this.paperColor = color;
  }

  static getColors() {
    return Colors;
  }

  convertCoordsToCoords(coords: Coords, direction: Direction): Coords {
    switch (direction) {
      case "abToPb":
        return [coords[0] * this.elementWidth, coords[1] * this.elementHeight];
      case "pbToAb":
        return [
          Math.floor(coords[0] / this.elementWidth),
          Math.floor(coords[1] / this.elementHeight),
        ];
      default:
        return coords;
    }
  }

  convertCoordsToIndex(coords: Coords, direction: Direction): number {
    switch (direction) {
      case "pbToPb":
        return coords[1] * this.pixelBuffer.width + coords[0];
      default:
        throw new Error("Invalid direction");
    }
  }

  private reset() {
    // Reset the screen
    this.inkColor = this.defaultInkColor;
    this.paperColor = this.defaultPaperColor;
    this.pixelBuffer.fill(0);
    this.text.cursor = [0, 0];
    this.attributeBuffer.fill([this.defaultPaperColor, this.defaultInkColor]);
  }

  render() {
    if (!this.context) {
      throw new Error("Unable to get 2d context");
    }

    const data = this.imageData.data;

    for (let y = 0; y < this.pixelBuffer.height; y++) {
      for (let x = 0; x < this.pixelBuffer.width; x++) {
        const index = this.convertCoordsToIndex([x, y], "pbToPb");
        const color = this.pixelBuffer[index];
        const attributeCoords = this.convertCoordsToCoords([x, y], "pbToAb");

        const [paper, ink] = this.attributeBuffer.get(attributeCoords);
        const [r, g, b] = color === 0 ? Colors[paper] : Colors[ink];

        const i = index * 4;
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = 0xff; // Alpha
      }
    }

    this.context.putImageData(this.imageData, 0, 0);
    this.reset();
  }
}

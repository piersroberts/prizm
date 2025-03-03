import type { Coords } from "./Screen";

export class PixelBuffer extends Uint8Array {
  width: number;
  height: number;
  constructor(width: number, height: number) {
    super(width * height);
    this.width = width;
    this.height = height;
  }

  public get(coords: Coords): number {
    const [x, y] = coords;
    return this[y * this.width + x];
  }

  public set(coords: Coords, value: number) {
    const [x, y] = coords;
    this[y * this.width + x] = value;
  }

  public copy(coords: Coords, width: number, height: number): PixelBuffer {
    const [x, y] = coords;
    const buffer = new PixelBuffer(width, height);
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        buffer.set([j, i], this.get([x + j, y + i]));
      }
    }
    return buffer;
  }

  public paste(coords: Coords, buffer: PixelBuffer) {
    const [x, y] = coords;
    for (let i = 0; i < buffer.height; i++) {
      for (let j = 0; j < buffer.width; j++) {
        this.set([x + j, y + i], buffer.get([j, i]));
      }
    }
  }

  public rotate(direction: "left" | "right") {
    const buffer = new PixelBuffer(this.height, this.width);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const value = this.get([x, y]);
        if (direction === "left") {
          buffer.set([this.height - y - 1, x], value);
        } else {
          buffer.set([y, this.width - x - 1], value);
        }
      }
    }
    return buffer;
  }

  public flip(direction: "horizontal" | "vertical") {
    const buffer = new PixelBuffer(this.width, this.height);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const value = this.get([x, y]);
        if (direction === "horizontal") {
          buffer.set([this.width - x - 1, y], value);
        } else {
          buffer.set([x, this.height - y - 1], value);
        }
      }
    }
    return buffer;
  }

  public scale(factor: number) {
    if (factor % 1 !== 0) {
      return this;
    }
    if (factor < 2) {
      return this;
    }
    const buffer = new PixelBuffer(this.width * factor, this.height * factor);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const value = this.get([x, y]);
        for (let i = 0; i < factor; i++) {
          for (let j = 0; j < factor; j++) {
            buffer.set([x * factor + j, y * factor + i], value);
          }
        }
      }
    }
    return buffer;
  }
}

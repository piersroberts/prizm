import type { Coords } from "./Screen";

/**
 * A pixel buffer is a buffer that stores the pixels of an image.
 */
export class PixelBuffer extends Uint8Array {
  width: number;
  height: number;

  /**
   * Creates an instance of PixelBuffer.
   * @param width
   * @param height
   */
  constructor(width: number, height: number) {
    super(width * height);
    this.width = width;
    this.height = height;
  }

  /**
   * Copy a region of the buffer.
   *
   * @param coords
   * @param width
   * @param height
   * @returns
   */
  public copy(coords: Coords, width: number, height: number): PixelBuffer {
    const [x, y] = coords;

    const buffer = new PixelBuffer(width, height);

    for (let i = 0; i < height; i++) {
      const sourceStart = (y + i) * this.width + x;
      const targetStart = i * width;
      for (let j = 0; j < width; j++) {
        buffer[targetStart + j] = this[sourceStart + j];
      }
    }

    return buffer;
  }

  /**
   * Paste a buffer into the buffer.
   *
   * @param coords
   * @param buffer
   */
  public paste(coords: Coords, buffer: PixelBuffer) {
    const [x, y] = coords;

    for (let i = 0; i < buffer.height; i++) {
      const sourceRowStart = i * buffer.width;
      const targetRowStart = (y + i) * this.width + x;
      for (let j = 0; j < buffer.width; j++) {
        this[targetRowStart + j] = buffer[sourceRowStart + j];
      }
    }
  }

  /**
   * Get the pixel at the specified coordinates.
   *
   * @param coords
   * @returns
   */
  public getPixel(coords: Coords): number {
    const [x, y] = coords;
    return this[y * this.width + x];
  }

  /**
   * Set the pixel at the specified coordinates.
   * @param coords
   * @param value
   */
  public setPixel(coords: Coords, value: number) {
    const [x, y] = coords;
    this[y * this.width + x] = value;
  }

  /**
   * Fill the buffer with a value.
   *
   * @param direction
   * @returns
   */
  public rotate(direction: "left" | "right") {
    const buffer = new PixelBuffer(this.height, this.width);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const value = this.getPixel([x, y]);
        if (direction === "right") {
          buffer.setPixel([this.height - y - 1, x], value);
        } else {
          buffer.setPixel([y, this.width - x - 1], value);
        }
      }
    }
    return buffer;
  }

  /**
   * Flip the buffer.
   *
   * @param direction
   * @returns
   */
  public flip(direction: "horizontal" | "vertical") {
    const buffer = new PixelBuffer(this.width, this.height);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const value = this.getPixel([x, y]);
        if (direction === "horizontal") {
          buffer.setPixel([this.width - x - 1, y], value);
        } else {
          buffer.setPixel([x, this.height - y - 1], value);
        }
      }
    }
    return buffer;
  }

  /**
   * Scale the buffer.
   *
   * @param factor
   * @returns
   */
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
        const value = this.getPixel([x, y]);
        for (let i = 0; i < factor; i++) {
          for (let j = 0; j < factor; j++) {
            buffer.setPixel([x * factor + j, y * factor + i], value);
          }
        }
      }
    }
    return buffer;
  }
}

import type { Palette } from "./Palette";
import type { Coords, Screen } from "./Screen";

/**
 * An attribute buffer is a buffer that stores the attributes of each pixel on the screen.
 * This includes the paper and pen colors.
 *
 * @class AttributeBuffer
 * @extends {Array<[paper: Palette, pen: Palette]>}
 */
export class AttributeBuffer extends Array<[paper: Palette, pen: Palette]> {
  width: number; // The width of the buffer
  height: number; // The height of the buffer

  /**
   * Creates an instance of AttributeBuffer.
   *
   * @param {Screen} screen - The screen to create the buffer for.
   */
  constructor(screen: Screen) {
    const width = screen.pixelBuffer.width / screen.elementWidth;
    const height = screen.pixelBuffer.height / screen.elementHeight;

    super(width * height);
    this.width = width;
    this.height = height;
    this.fill([screen.defaultPaperColor, screen.defaultInkColor]);
  }

  /**
   * Get the attributes for a pixel at the specified coordinates.
   *
   * @param {Coords} coords - The coordinates of the pixel.
   * @returns {[paper: Palette, pen: Palette]}
   */
  get(coords: Coords): [paper: Palette, pen: Palette] {
    const [x, y] = coords;
    return this[y * this.width + x];
  }

  /**
   * Set the attributes for a pixel at the specified coordinates.
   *
   * @param {Coords} coords - The coordinates of the pixel.
   * @param {Palette} paper - The paper color.
   * @param {Palette} pen - The pen color.
   */
  set(coords: Coords, paper: Palette, pen: Palette) {
    const [x, y] = coords;
    this[y * this.width + x] = [paper, pen];
  }
}

import type { FontCharacter } from "./Font";
import type { Coords, Screen } from "./Screen";
import { pointInPolygon, pointInTriangle } from "./lib/maths";

/**
 * A graphics object is used to draw shapes and text to the screen.
 *
 * @class Graphics
 */
export class Graphics {
  private screen: Screen;

  /**
   * Creates an instance of Graphics.
   *
   * @param {Screen} screen - The screen to draw to.
   */
  constructor(screen: Screen) {
    this.screen = screen;
  }

  /**
   * Set a pixel in the buffer.
   *
   * @param coords
   * @param color
   */
  private setPixel(coords: Coords, color = 1) {
    // Set a pixel in the buffer
    const [x, y] = coords;

    // Ignore pixels outside the screen
    if (
      x < 0 ||
      x >= this.screen.pixelBuffer.width ||
      y < 0 ||
      y >= this.screen.pixelBuffer.height
    ) {
      return;
    }

    // Set the pixel color
    const index = y * this.screen.pixelBuffer.width + x;
    this.screen.pixelBuffer[index] = color;

    const attributeCoords = this.screen.convertCoordsToCoords(coords, "pbToAb");
    const attributePixelCoords = this.screen.convertCoordsToCoords(
      attributeCoords,
      "abToPb",
    );

    const attribute = this.screen.attributeBuffer.get(attributeCoords);

    const attributeRegionPixels = this.screen.pixelBuffer.copy(
      attributePixelCoords,
      this.screen.elementWidth,
      this.screen.elementHeight,
    );

    // Cache first pixel and optimize check for all same pixels
    const firstPixel = attributeRegionPixels[0];
    const allSame = attributeRegionPixels.every(
      (pixel) => pixel === firstPixel,
    );

    // // If all pixels are the same, set all to 0
    if (allSame) {
      attributeRegionPixels.fill(0);
    }

    // Set attribute pixel color
    this.screen.attributeBuffer.set(
      attributeCoords,
      allSame ? attribute[1] : attribute[0],
      allSame ? attribute[1] : this.screen.inkColor,
    );

    this.screen.pixelBuffer.paste(attributePixelCoords, attributeRegionPixels);
  }

  /**
   * Draw a line to the buffer.
   *
   * @param startCoords
   * @param endCoords
   * @param color
   */
  public drawLine(startCoords: Coords, endCoords: Coords, color = 1) {
    // Convert the coordinates to integers
    const roundedStartCoords: Coords = [
      Math.round(startCoords[0]),
      Math.round(startCoords[1]),
    ];
    const roundedEndCoords: Coords = [
      Math.round(endCoords[0]),
      Math.round(endCoords[1]),
    ];
    // Draw a line to the buffer
    const [x1, y1] = roundedStartCoords;
    const [x2, y2] = roundedEndCoords;
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
    let x = x1;
    let y = y1;

    while (true) {
      this.setPixel([x, y], color);
      if (x === x2 && y === y2) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
  }

  /**
   * Draw a triangle to the buffer.
   *
   * @param point1
   * @param point2
   * @param point3
   * @param color
   */
  public drawTriangle(
    point1: Coords,
    point2: Coords,
    point3: Coords,

    color = 1,
  ) {
    // Draw a triangle to the buffer
    this.drawLine(point1, point2, color);
    this.drawLine(point2, point3, color);
    this.drawLine(point3, point1, color);
  }

  /**
   * Draw a polygon to the buffer.
   *
   * @param points
   * @param color
   */
  public drawPolygon(points: Array<Coords>, color = 1) {
    // Draw a polygon to the buffer
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      this.drawLine(p1, p2, color);
    }
  }

  /**
   * Draw a circle to the buffer.
   *
   * @param coords
   * @param radius
   * @param color
   */
  public drawCircle(coords: Coords, radius: number, color = 1) {
    const [x0, y0] = coords;
    // Draw a circle to the buffer
    let x = radius - 1;
    let y = 0;
    let dx = 1;
    let dy = 1;
    let err = dx - (radius << 1);

    while (x >= y) {
      this.setPixel([x0 + x, y0 + y], color);
      this.setPixel([x0 + y, y0 + x], color);
      this.setPixel([x0 - y, y0 + x], color);
      this.setPixel([x0 - x, y0 + y], color);
      this.setPixel([x0 - x, y0 - y], color);
      this.setPixel([x0 - y, y0 - x], color);
      this.setPixel([x0 + y, y0 - x], color);
      this.setPixel([x0 + x, y0 - y], color);

      if (err <= 0) {
        y++;
        err += dy;
        dy += 2;
      }
      if (err > 0) {
        x--;
        dx += 2;
        err += dx - (radius << 1);
      }
    }
  }

  /**
   * Fill a circle in the buffer.
   *
   * @param coords
   * @param radius
   * @param color
   */
  public fillCircle(coords: Coords, radius: number, color = 1) {
    const [x0, y0] = coords;
    let x = radius;
    let y = 0;
    let err = 0;

    while (x >= y) {
      // Fill horizontal lines for each octant
      for (let i = x0 - x; i <= x0 + x; i++) {
        this.setPixel([i, y0 + y], color);
        this.setPixel([i, y0 - y], color);
      }
      for (let i = x0 - y; i <= x0 + y; i++) {
        this.setPixel([i, y0 + x], color);
        this.setPixel([i, y0 - x], color);
      }

      y += 1;
      err += 1 + 2 * y;
      if (2 * (err - x) + 1 > 0) {
        x -= 1;
        err += 1 - 2 * x;
      }
    }
  }

  /**
   * Draw a rectangle to the buffer.
   *
   * @param coords
   * @param width
   * @param height
   * @param color
   */
  public drawRect(coords: Coords, width: number, height: number, color = 1) {
    const [x, y] = coords;
    // Draw a rectangle to the buffer
    this.drawLine([x, y], [x + width, y], color);
    this.drawLine([x + width, y], [x + width, y + height], color);
    this.drawLine([x + width, y + height], [x, y + height], color);
    this.drawLine([x, y + height], [x, y], color);
  }

  /**
   * Fill a rectangle in the buffer.
   * @param coords
   * @param width
   * @param height
   * @param color
   */
  public fillRect(coords: Coords, width: number, height: number, color = 1) {
    const [x, y] = coords;
    // Fill a rectangle in the buffer
    for (let cy = y; cy < y + height; cy++) {
      for (let cx = x; cx < x + width; cx++) {
        this.setPixel([cx, cy], color);
      }
    }
  }

  /**
   * Draw an arc to the buffer.
   *
   * @param coords
   * @param radius
   * @param startAngle
   * @param endAngle
   * @param color
   */
  public drawArc(
    coords: Coords,
    radius: number,
    startAngle: number,
    endAngle: number,
    color = 1,
  ) {
    const [x0, y0] = coords;
    const step = 1 / radius;
    for (let t = startAngle; t < endAngle; t += step) {
      const x = x0 + radius * Math.cos(t);
      const y = y0 + radius * Math.sin(t);
      this.setPixel([Math.round(x), Math.round(y)], color);
    }
  }

  /**
   * Clear the buffer.
   *
   * @param color
   */
  public clear(color = 0) {
    // Clear the buffer
    this.screen.pixelBuffer.fill(color);
  }

  /**
   * Fill a triangle in the buffer.
   *
   * @param point1
   * @param point2
   * @param point3
   * @param color
   */
  public fillTriangle(
    point1: Coords,
    point2: Coords,
    point3: Coords,
    color = 1,
  ) {
    // Fill a triangle in the buffer
    const [x1, y1] = point1;
    const [x2, y2] = point2;
    const [x3, y3] = point3;
    const minX = Math.min(x1, x2, x3);
    const minY = Math.min(y1, y2, y3);
    const maxX = Math.max(x1, x2, x3);
    const maxY = Math.max(y1, y2, y3);

    for (let y = minY; y < maxY; y++) {
      for (let x = minX; x < maxX; x++) {
        if (pointInTriangle([x, y], [x1, y1], [x2, y2], [x3, y3])) {
          this.setPixel([x, y], color);
        }
      }
    }
  }

  /**
   * Fill a polygon in the buffer.
   *
   * @param points
   * @param color
   */
  public fillPolygon(points: Array<Coords>, color = 1) {
    // Fill a polygon in the buffer

    const minX = Math.min(...points.map((p) => p[0]));
    const minY = Math.min(...points.map((p) => p[1]));
    const maxX = Math.max(...points.map((p) => p[0]));
    const maxY = Math.max(...points.map((p) => p[1]));

    for (let y = minY; y < maxY; y++) {
      for (let x = minX; x < maxX; x++) {
        if (pointInPolygon([x, y], points)) {
          this.setPixel([x, y], color);
        }
      }
    }
  }
  /**
   * Fill the buffer with noise.
   *
   * @param color
   */
  public fillNoise(color = 1) {
    // Fill the buffer with noise
    for (let y = 0; y < this.screen.pixelBuffer.height; y++) {
      for (let x = 0; x < this.screen.pixelBuffer.width; x++) {
        this.setPixel([x, y], Math.random() > 0.5 ? color : 0);
      }
    }
  }

  /**
   * Draw a character to the buffer.
   *
   * @param character
   * @param x
   * @param y
   * @param width
   * @param height
   */
  public drawCharacter(
    character: FontCharacter,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    // Draw a character to the buffer
    for (let cy = 0; cy < height; cy++) {
      for (let cx = 0; cx < width; cx++) {
        this.setPixel([x + cx, y + cy], character[cy * width + cx] ? 1 : 0);
      }
    }
  }
}

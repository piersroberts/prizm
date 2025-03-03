import type { Coords } from "../Screen";

/**
 * Calculate the bernstein value.
 * A Bernstein polynomial is a polynomial in the Bernstein form, i.e., a linear combination of Bernstein basis polynomials.
 * In layman's terms, it's a way to calculate a point on a curve.
 *
 * @param n // The degree of the polynomial
 * @param i // The index of the polynomial
 * @param t // The value to calculate the polynomial at
 * @returns The bernstein value
 */
export function bernstein(n: number, i: number, t: number) {
  // Calculate the bernstein value
  return (
    (factorial(n) / (factorial(i) * factorial(n - i))) *
    t ** i *
    (1 - t) ** (n - i)
  );
}

/**
 * Calculate the factorial of a number.
 *
 * @param n // The number to calculate the factorial of
 * @returns // The factorial value
 */
export function factorial(n: number): number {
  // Calculate the factorial value
  if (n === 0) {
    return 1;
  }
  return n * factorial(n - 1);
}

/**
 * See if a point is inside a triangle.
 *
 * @param point // The point to check
 * @param corner1 // The first corner of the triangle
 * @param corner2 // The second corner of the triangle
 * @param corner3 // The third corner of the triangle
 * @returns // Whether the point is inside the triangle
 */
export function pointInTriangle(
  point: Coords,
  corner1: Coords,
  corner2: Coords,
  corner3: Coords,
): boolean {
  const [x, y] = point;
  const [x1, y1] = corner1;
  const [x2, y2] = corner2;
  const [x3, y3] = corner3;
  const denominator = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
  const a = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / denominator;
  const b = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / denominator;
  const c = 1 - a - b;
  return 0 <= a && a <= 1 && 0 <= b && b <= 1 && 0 <= c && c <= 1;
}

/**
 * See if a point is inside a polygon.
 *
 * @param point // The point to check
 * @param points // The points of the polygon
 * @returns // Whether the point is inside the polygon
 */
export function pointInPolygon(point: Coords, points: Array<Coords>): boolean {
  let inside = false;
  const [x, y] = point;

  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i][0];
    const yi = points[i][1];
    const xj = points[j][0];
    const yj = points[j][1];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) {
      inside = !inside;
    }
  }
  return inside;
}

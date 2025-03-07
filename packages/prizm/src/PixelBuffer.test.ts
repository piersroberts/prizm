import { describe, it, expect } from "vitest";
import { PixelBuffer } from "./PixelBuffer";

describe("PixelBuffer", () => {
  describe("getPixel", () => {
    it("should get the correct pixel value at [0, 0]", () => {
      const buffer = new PixelBuffer(3, 3);
      buffer[0] = 1; // Set top-left pixel

      expect(buffer.getPixel([0, 0])).toBe(1);
    });

    it("should get the correct pixel value in the middle", () => {
      const buffer = new PixelBuffer(3, 3);
      buffer[4] = 2; // Middle pixel at [1, 1] equals index 4 (1*3+1)

      expect(buffer.getPixel([1, 1])).toBe(2);
    });

    it("should get the correct pixel value at bottom-right", () => {
      const buffer = new PixelBuffer(3, 3);
      buffer[8] = 3; // Bottom-right at [2, 2] equals index 8 (2*3+2)

      expect(buffer.getPixel([2, 2])).toBe(3);
    });

    it("should correctly calculate index for various coordinates", () => {
      const buffer = new PixelBuffer(5, 5);

      // Set values at specific positions
      buffer[7] = 42; // [2, 1] = 1*5+2 = 7
      buffer[16] = 99; // [1, 3] = 3*5+1 = 16
      buffer[24] = 128; // [4, 4] = 4*5+4 = 24

      expect(buffer.getPixel([2, 1])).toBe(42);
      expect(buffer.getPixel([1, 3])).toBe(99);
      expect(buffer.getPixel([4, 4])).toBe(128);
    });

    });

    describe("setPixel", () => {
        it("should set the correct pixel value at [0, 0]", () => {
            const buffer = new PixelBuffer(3, 3);
            buffer.setPixel([0, 0], 5);
            expect(buffer[0]).toBe(5);
        });

        it("should set the correct pixel value in the middle", () => {
            const buffer = new PixelBuffer(3, 3);
            buffer.setPixel([1, 1], 7);
            expect(buffer[4]).toBe(7);
        });

        it("should set the correct pixel value at bottom-right", () => {
            const buffer = new PixelBuffer(5, 5);
            buffer.setPixel([4, 4], 9);
            expect(buffer[24]).toBe(9);
        });
    });

    describe("copy", () => {
        it("should not return an array of zeores", () => {
            const buffer = new PixelBuffer(5, 5);
            buffer.fill(1);
            expect(buffer.every((value) => value === 1)).toBe(true);
            const copied = buffer.copy([0, 0], 5, 5);
            expect(copied.every((value) => value === 0)).toBe(false);
        });

        it("should copy a region from the buffer", () => {
            const buffer = new PixelBuffer(5, 5);
            
            // Fill with test pattern
            for (let y = 0; y < 5; y++) {
                for (let x = 0; x < 5; x++) {
                    buffer.setPixel([x, y], y * 5 + x);
                }
            }

            const copied = buffer.copy([1, 1], 3, 2);
            expect(copied.width).toBe(3);
            expect(copied.height).toBe(2);
            expect(copied.getPixel([0, 0])).toBe(6);
            expect(copied.getPixel([1, 0])).toBe(7);
            expect(copied.getPixel([2, 0])).toBe(8);
            expect(copied.getPixel([0, 1])).toBe(11);
            expect(copied.getPixel([1, 1])).toBe(12);
            expect(copied.getPixel([2, 1])).toBe(13);
        });

        it("should copy from the edge of the buffer", () => {
            const buffer = new PixelBuffer(4, 4);
            
            // Fill with test values
            for (let i = 0; i < 16; i++) {
                buffer[i] = i;
            }

            const copied = buffer.copy([2, 2], 2, 2);
            expect(copied.getPixel([0, 0])).toBe(10);
            expect(copied.getPixel([1, 0])).toBe(11);
            expect(copied.getPixel([0, 1])).toBe(14);
            expect(copied.getPixel([1, 1])).toBe(15);
        });
    });

    describe("paste", () => {
        it("should paste a buffer into another buffer", () => {
            const target = new PixelBuffer(5, 5);
            const source = new PixelBuffer(2, 2);
            
            source.setPixel([0, 0], 1);
            source.setPixel([1, 0], 2);
            source.setPixel([0, 1], 3);
            source.setPixel([1, 1], 4);

            target.paste([1, 1], source);
            
            expect(target.getPixel([1, 1])).toBe(1);
            expect(target.getPixel([2, 1])).toBe(2);
            expect(target.getPixel([1, 2])).toBe(3);
            expect(target.getPixel([2, 2])).toBe(4);
        });

        it("should paste at the edge of the buffer", () => {
            const target = new PixelBuffer(4, 4);
            const source = new PixelBuffer(2, 2);
            
            source.setPixel([0, 0], 5);
            source.setPixel([1, 0], 6);
            source.setPixel([0, 1], 7);
            source.setPixel([1, 1], 8);

            target.paste([2, 2], source);
            
            expect(target.getPixel([2, 2])).toBe(5);
            expect(target.getPixel([3, 2])).toBe(6);
            expect(target.getPixel([2, 3])).toBe(7);
            expect(target.getPixel([3, 3])).toBe(8);
        });
    });

    describe("rotate", () => {
        it("should rotate a square buffer to the left", () => {
            const buffer = new PixelBuffer(2, 2);
            buffer.setPixel([0, 0], 1);
            buffer.setPixel([1, 0], 2);
            buffer.setPixel([0, 1], 3);
            buffer.setPixel([1, 1], 4);

            const rotated = buffer.rotate("left");

            expect(rotated.width).toBe(2);
            expect(rotated.height).toBe(2);
            expect(rotated.getPixel([0, 0])).toBe(2);
            expect(rotated.getPixel([1, 0])).toBe(4);
            expect(rotated.getPixel([0, 1])).toBe(1);
            expect(rotated.getPixel([1, 1])).toBe(3);
        });

        it("should rotate a square buffer to the right", () => {
            const buffer = new PixelBuffer(2, 2);
            buffer.setPixel([0, 0], 1);
            buffer.setPixel([1, 0], 2);
            buffer.setPixel([0, 1], 3);
            buffer.setPixel([1, 1], 4);

            const rotated = buffer.rotate("right");

            expect(rotated.getPixel([0, 0])).toBe(3);
            expect(rotated.getPixel([1, 0])).toBe(1);
            expect(rotated.getPixel([0, 1])).toBe(4);
            expect(rotated.getPixel([1, 1])).toBe(2);
        });

        it("should rotate a non-square buffer", () => {
            const buffer = new PixelBuffer(3, 2);
            buffer.setPixel([0, 0], 1);
            buffer.setPixel([1, 0], 2);
            buffer.setPixel([2, 0], 3);
            buffer.setPixel([0, 1], 4);
            buffer.setPixel([1, 1], 5);
            buffer.setPixel([2, 1], 6);

            const rotated = buffer.rotate("left");

            expect(rotated.width).toBe(2);
            expect(rotated.height).toBe(3);
            expect(rotated.getPixel([0, 0])).toBe(3);
            expect(rotated.getPixel([1, 0])).toBe(6);
            expect(rotated.getPixel([1, 1])).toBe(5);
            expect(rotated.getPixel([1, 2])).toBe(4);
            expect(rotated.getPixel([0, 1])).toBe(2);
            expect(rotated.getPixel([0, 2])).toBe(1);
        });
    });

    describe("flip", () => {
        it("should flip a buffer horizontally", () => {
            const buffer = new PixelBuffer(3, 2);
            buffer.setPixel([0, 0], 1);
            buffer.setPixel([1, 0], 2);
            buffer.setPixel([2, 0], 3);
            buffer.setPixel([0, 1], 4);
            buffer.setPixel([1, 1], 5);
            buffer.setPixel([2, 1], 6);

            const flipped = buffer.flip("horizontal");

            expect(flipped.getPixel([0, 0])).toBe(3);
            expect(flipped.getPixel([1, 0])).toBe(2);
            expect(flipped.getPixel([2, 0])).toBe(1);
            expect(flipped.getPixel([0, 1])).toBe(6);
            expect(flipped.getPixel([1, 1])).toBe(5);
            expect(flipped.getPixel([2, 1])).toBe(4);
        });

        it("should flip a buffer vertically", () => {
            const buffer = new PixelBuffer(3, 2);
            buffer.setPixel([0, 0], 1);
            buffer.setPixel([1, 0], 2);
            buffer.setPixel([2, 0], 3);
            buffer.setPixel([0, 1], 4);
            buffer.setPixel([1, 1], 5);
            buffer.setPixel([2, 1], 6);

            const flipped = buffer.flip("vertical");

            expect(flipped.getPixel([0, 0])).toBe(4);
            expect(flipped.getPixel([1, 0])).toBe(5);
            expect(flipped.getPixel([2, 0])).toBe(6);
            expect(flipped.getPixel([0, 1])).toBe(1);
            expect(flipped.getPixel([1, 1])).toBe(2);
            expect(flipped.getPixel([2, 1])).toBe(3);
        });
    });

    describe("scale", () => {
        it("should scale a buffer by factor 2", () => {
            const buffer = new PixelBuffer(2, 2);
            buffer.setPixel([0, 0], 1);
            buffer.setPixel([1, 0], 2);
            buffer.setPixel([0, 1], 3);
            buffer.setPixel([1, 1], 4);

            const scaled = buffer.scale(2);

            expect(scaled.width).toBe(4);
            expect(scaled.height).toBe(4);
            
            // Check first row
            expect(scaled.getPixel([0, 0])).toBe(1);
            expect(scaled.getPixel([1, 0])).toBe(1);
            expect(scaled.getPixel([2, 0])).toBe(2);
            expect(scaled.getPixel([3, 0])).toBe(2);
            
            // Check second row
            expect(scaled.getPixel([0, 1])).toBe(1);
            expect(scaled.getPixel([1, 1])).toBe(1);
            expect(scaled.getPixel([2, 1])).toBe(2);
            expect(scaled.getPixel([3, 1])).toBe(2);
            
            // Check third row
            expect(scaled.getPixel([0, 2])).toBe(3);
            expect(scaled.getPixel([1, 2])).toBe(3);
            expect(scaled.getPixel([2, 2])).toBe(4);
            expect(scaled.getPixel([3, 2])).toBe(4);
            
            // Check fourth row
            expect(scaled.getPixel([0, 3])).toBe(3);
            expect(scaled.getPixel([1, 3])).toBe(3);
            expect(scaled.getPixel([2, 3])).toBe(4);
            expect(scaled.getPixel([3, 3])).toBe(4);
        });

        it("should return the original buffer for non-integer factors", () => {
            const buffer = new PixelBuffer(2, 2);
            buffer.setPixel([0, 0], 1);
            
            const scaled = buffer.scale(1.5);
            
            expect(scaled).toBe(buffer);
        });

        it("should return the original buffer for factors less than 2", () => {
            const buffer = new PixelBuffer(2, 2);
            buffer.setPixel([0, 0], 1);
            
            const scaled = buffer.scale(1);
            
            expect(scaled).toBe(buffer);
        });
    });
});

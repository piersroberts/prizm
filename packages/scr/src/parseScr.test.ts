import { describe, expect, it } from "vitest";
import { parseScr } from "./parseScr";
import { readFileSync } from "node:fs";

const scrData = readFileSync("./fixtures/Fairlight.scr");

describe("Parser module", () => {
  it("should parse a project", () => {
    const parsedScr = parseScr(scrData);
    expect(parsedScr).toBeDefined();

    expect(parsedScr.attributeBuffer.attributes.length).toBe(768);
    expect(parsedScr.pixelBuffer.pixels.length).toBe(49152);
    expect(parsedScr.attributeBuffer.attributes[0].ink).toBe(0);
    expect(parsedScr.attributeBuffer.attributes[0].paper).toBe(7);
    expect(parsedScr.attributeBuffer.attributes[0].bright).toBe(false);
    expect(parsedScr.attributeBuffer.attributes[0].flash).toBe(false);
  });
});

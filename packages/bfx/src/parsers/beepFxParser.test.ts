import { describe, it, expect } from "vitest";
import { loadProject } from "./beepFxParser";
import fs from "node:fs";

const demo1 = fs.readFileSync("./fixtures/demo.spj", "utf8");

describe("BFX module", () => {
  it("should parse a project", () => {
    const { effectBank } = loadProject(demo1);

    expect(effectBank.get("Boom 5")).toBeDefined();
    expect(effectBank.get("Grr! (voice)")).toBeDefined();
    expect(effectBank.get("Grr! (voice)")?.frames).toEqual([
      {
        params: {
          type: 3,
          frames: 10,
          frameLen: 1000,
          tonePitch: 200,
          tonePitchSlide: 0,
          noisePitch: 100,
          noisePitchSlide: 0,
          duty: 128,
          dutySlide: 0,
          samplePitch: 100,
          sampleNumber: 0,
          sampleOffset: 0,
        },
      },
    ]);
  });
  it("samples should be parsed", () => {
    const { samples } = loadProject(demo1);
    expect(samples[0].sampleData.length).toEqual(262);
    expect(samples[1].sampleData[0]).toEqual(203);
  });
});

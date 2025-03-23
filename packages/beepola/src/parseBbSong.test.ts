import { describe, expect, it } from "vitest";
import { parseBbSong } from "./parseBbSong";
import { readFileSync } from "node:fs";

const song = readFileSync("./fixtures/ChuckRock.bbsong");

describe("Parser module", () => {
  it("should parse a project", () => {
    const parsedSong = parseBbSong(song);
    expect(parsedSong).toBeDefined();

    console.log(parsedSong);
    expect(parsedSong?.infoChunk?.songTitle?.value).toEqual("Chuck Rock");
  });
});

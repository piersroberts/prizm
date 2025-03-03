import type { Coords, Screen } from "./Screen";

export type TextOptions = {
  wrap?: "word" | "character";
  align?: "left" | "center" | "right";
};

export class Text {
  cursor: [x: number, y: number];
  screen: Screen;
  constructor(screen: Screen) {
    this.cursor = [0, 0];
    this.screen = screen;
  }

  /**
   * Set the text cursor position to a spot on the attribute buffer
   * @param x
   * @param y
   */
  public setCursor(coords: Coords) {
    this.cursor = coords;
  }

  /**
   * Move the text cursor by a certain amount on the attribute buffer
   * @param x
   * @param y
   */
  public moveCursor(x: number, y: number) {
    this.cursor[0] += x;
    this.cursor[1] += y;
  }

  /**
   * Write text to the screen at the current cursor position on the cursor
   * @param text
   * @param options.wrap - Wrap text by word or character
   * @param options.align - Align text to the left, center, or right
   *
   */
  public write(text: string, options?: TextOptions) {
    const font = this.screen.fonts.get("cga");
    if (!font) {
      throw new Error("Font not found");
    }
    const words = text.split(" ");

    for (const word of words) {
      // Check if we can fit the next word on the current line
      if (
        options?.wrap === "word" &&
        this.cursor[0] + word.length >
          this.screen.pixelBuffer.width / font.characteWidth
      ) {
        // If we can't, move the cursor to the next line
        this.cursor[0] = 0;
        this.cursor[1]++;
      }
      const characters = word.split("");
      for (const character of characters) {
        // Check if we can fit the next character on the current line
        if (
          options?.wrap === "character" &&
          this.cursor[0] + 1 >
            this.screen.pixelBuffer.width / font.characteWidth
        ) {
          // If we can't, move the cursor to the next line
          this.cursor[0] = 0;
          this.cursor[1]++;
        }
        this.screen.gfx.drawCharacter(
          font.characters[character.charCodeAt(0)],
          this.cursor[0] * font.characteWidth,
          this.cursor[1] * font.characterHeight,
          font.characteWidth,
          font.characterHeight,
        );

        this.cursor[0]++;
      }
      this.cursor[0]++;
    }
  }
  /**
   * Write text to the screen at the current cursor position on the cursor and move the cursor to the next line
   * @param text
   * @param options.wrap - Wrap text by word or character
   * @param options.align - Align text to the left, center, or right
   */
  public writeLine(text: string, options?: TextOptions) {
    this.write(text, options);
    this.cursor[0] = 0;
    this.cursor[1]++;
  }
}

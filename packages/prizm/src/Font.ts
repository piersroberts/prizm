/**
 * Configuration options for defining a font.
 *
 * @interface FontOptions
 * @property {string} name - The name of the font.
 * @property {number} characterWidth - The width of each character in the font in pixels.
 * @property {number} characterHeight - The height of each character in the font in pixels.
 * @property {[number, number, number, number]} [margin] - Optional margins [top, right, bottom, left] around each character in pixels.
 */
export type FontOptions = {
  name: string;
  characterWidth: number;
  characterHeight: number;
  margin?: [number, number, number, number];
};

/**
 * A font character is a collection of booleans that represent the pixels of a character.
 *
 * @type {FontCharacter}
 */
export type FontCharacter = boolean[];

/**
 * A font is a collection of characters that can be drawn on the screen.
 *
 * @class Font
 */
export class Font {
  private width: number;
  private height: number;
  characters: FontCharacter[];
  characteWidth: number;
  characterHeight: number;
  margin: { top: number; right: number; bottom: number; left: number };

  /**
   * Creates an instance of Font.
   *
   * @param {HTMLImageElement} image - The image containing the font.
   * @param {FontOptions} options - The options for the font.
   */
  constructor(image: HTMLImageElement, options: FontOptions) {
    this.width = image.width;
    this.height = image.height;
    this.characteWidth = options.characterWidth;
    this.characterHeight = options.characterHeight;
    this.margin = {
      top: options.margin ? options.margin[0] : 0,
      right: options.margin ? options.margin[1] : 0,
      bottom: options.margin ? options.margin[2] : 0,
      left: options.margin ? options.margin[3] : 0,
    };

    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Unable to get 2d context");
    }
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;
    const characters: FontCharacter[] = [];

    for (
      let y = 0;
      y < this.height;
      y += this.characterHeight + this.margin.top + this.margin.bottom
    ) {
      for (
        let x = 0;
        x < this.width;
        x += this.characteWidth + this.margin.left + this.margin.right
      ) {
        const character: FontCharacter = [];
        for (
          let cy = this.margin.top;
          cy < this.characterHeight + this.margin.top;
          cy++
        ) {
          for (
            let cx = this.margin.left;
            cx < this.characteWidth + this.margin.left;
            cx++
          ) {
            const index = (y + cy) * this.width * 4 + (x + cx) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            character.push(r > 0 || g > 0 || b > 0);
          }
        }
        characters.push(character);
      }
    }

    this.characters = characters;
  }

  /**
   * Get a character from the font.
   *
   * @param {number} char - The character to get.
   * @returns {FontCharacter} The character.
   */
  public getCharacter(char: number): FontCharacter {
    return this.characters[char];
  }
}

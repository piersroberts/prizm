import { Palette } from "./Palette";

/**
 * A mapping of palette colors to their RGB values.
 */
export const Colors: Record<Palette, [number, number, number]> = {
  [Palette.BLACK]: [0x00, 0x00, 0x00],
  [Palette.BLUE]: [0x00, 0x00, 0xff],
  [Palette.RED]: [0xff, 0x00, 0x00],
  [Palette.MAGENTA]: [0xff, 0x00, 0xff],
  [Palette.GREEN]: [0x00, 0xff, 0x00],
  [Palette.CYAN]: [0x00, 0xff, 0xff],
  [Palette.YELLOW]: [0xff, 0xff, 0x00],
  [Palette.WHITE]: [0xcc, 0xcc, 0xcc],
  [Palette.BRIGHT_BLACK]: [0x51, 0x51, 0x51],
  [Palette.BRIGHT_BLUE]: [0x00, 0x00, 0xff],
  [Palette.BRIGHT_RED]: [0xff, 0x00, 0x00],
  [Palette.BRIGHT_MAGENTA]: [0xff, 0x00, 0xff],
  [Palette.BRIGHT_GREEN]: [0x00, 0xff, 0x00],
  [Palette.BRIGHT_CYAN]: [0x00, 0xff, 0xff],
  [Palette.BRIGHT_YELLOW]: [0xff, 0xff, 0],
  [Palette.BRIGHT_WHITE]: [0xff, 0xff, 0xff],
};

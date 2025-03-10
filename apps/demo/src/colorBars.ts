import type { Screen } from "@prizmjs/prizm";
import { Palette } from "@prizmjs/prizm";

export const colorBars = (screen: Screen) =>
  function loop(f: number) {
    if (screen.loading.size > 0) {
      screen.gfx.fillNoise();
      screen.randomizeInkPaper();
      return requestAnimationFrame(loop);
    }

    screen.setInkColor(Palette.WHITE);
    screen.gfx.fillRect([2, 0], 36, 192);
    screen.setInkColor(Palette.YELLOW);
    screen.gfx.fillRect([2 + 36, 0], 36, 192);
    screen.setInkColor(Palette.BRIGHT_CYAN);
    screen.gfx.fillRect([2 + 36 + 36, 0], 36, 192);
    screen.setInkColor(Palette.BRIGHT_GREEN);
    screen.gfx.fillRect([2 + 36 + 36 + 36, 0], 36, 192);
    screen.setInkColor(Palette.BRIGHT_MAGENTA);
    screen.gfx.fillRect([2 + 36 + 36 + 36 + 36, 0], 36, 192);
    screen.setInkColor(Palette.BRIGHT_RED);
    screen.gfx.fillRect([2 + 36 + 36 + 36 + 36 + 36, 0], 36, 192);
    screen.setInkColor(Palette.BRIGHT_BLUE);
    screen.gfx.fillRect([2 + 36 + 36 + 36 + 36 + 36 + 36, 0], 36, 192);

    screen.setInkColor(Palette.BLACK);
    screen.gfx.fillRect([40, 64], 160, 48);

    screen.setInkColor(Palette.WHITE);
    screen.gfx.drawRect([40, 64], 160, 48);

    screen.setInkColor(Palette.GREEN);
    screen.gfx.drawCircle([170, 88], 20);
    // Draw a spinning line that rotates once per second

    screen.text.setCursor([6, 9]);
    const time = new Date();
    screen.text.writeLine(
      `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`,
    );

    screen.setInkColor(Palette.BRIGHT_RED);
    screen.gfx.drawLine(
      [170, 88],
      [
        170 + Math.cos((f / 1000) * Math.PI * 2) * 20,
        88 + Math.sin((f / 1000) * Math.PI * 2) * 20,
      ],
    );

    // Compute the current frames per second
    const fps = 1000 / (f - screen.lastFrame);
    screen.lastFrame = f;
    screen.text.setCursor([6, 1]);
    screen.text.writeLine(`FPS: ${Math.round(fps * 100) / 100}`);
    // screen.randomizeInkPaper();

    screen.render();

    requestAnimationFrame(loop);
  };

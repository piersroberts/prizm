import "./style.css";

import { Screen, Palette } from "@prizm/prizm";

const canvas = document.getElementById("screen") as HTMLCanvasElement;
canvas.onclick = () => {
  // Toggle fullscreen
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  }
};

const screen = new Screen(canvas, {
  width: 256,
  height: 192,
  targetFps: 30,
  element: { width: 8, height: 8 },
  defaultPaperColor: Palette.BRIGHT_BLACK,
  defaultInkColor: Palette.BLACK,
});

screen.loadFont("./fonts/cga.png", {
  name: "cga",
  characterWidth: 8,
  characterHeight: 8,
  margin: [0, 1, 1, 0],
});

function loop(f: number) {
  if (screen.loading.size > 0) {
    console.log("loading");
    requestAnimationFrame(loop);
  }
  if (f > screen.lastFrame + 1000 / screen.targetFps) {
    screen.lastFrame = f;

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

    // screen.setInkColor(Palette.GREEN);
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

    screen.render();
  }
  requestAnimationFrame(loop);
}

loop(0);

import type { Screen, Coords } from "@prizmjs/prizm";
import { Palette } from "@prizmjs/prizm";

export const textInput = (screen: Screen) => {
  const { width, height } = screen.attributeBuffer;

  const MAX_SPEED = 1;
  const ACCELERATION = 0.1;

  const state = {
    position: [0, 0] as Coords,
    currentSpeed: 0,

    moveLeft(frame: number) {
      // Accelerate to the left while the key is held down then decelerate
      // when the key is released
      if (this.currentSpeed < MAX_SPEED) {
        this.currentSpeed += ACCELERATION;
      }
      this.position[0] -= this.currentSpeed;
    },
    moveRight() {
      this.position[0] = this.position[0] === width ? 0 : this.position[0] + 1;
    },
    moveUp() {
      this.position[1] = this.position[1] === 0 ? 0 : this.position[1] - 1;
    },
    moveDown() {
      this.position[1] = this.position[1] === height ? 0 : this.position[1] + 1;
    },
  };

  return function loop(f: number) {
    if (screen.loading.size > 0) {
      screen.gfx.fillNoise();
      screen.randomizeInkPaper();
      return requestAnimationFrame(loop);
    }
    screen.setPaperColor(Palette.BLUE);
    screen.setInkColor(Palette.BRIGHT_RED);

    // screen.text.setCursor([6, 1]);
    screen.text.writeLine(`${state.position[0]}, ${state.position[1]}`);

    screen.text.setCursor(state.position);

    // screen.text.writeLine(screen.input.inputBuffer, { wrap: "word" });
    if (screen.input.isKeyDown("ArrowLeft")) {
      state.moveLeft(f);
    }
    if (screen.input.isKeyDown("ArrowRight")) {
      state.moveRight();
    }
    if (screen.input.isKeyDown("ArrowUp")) {
      state.moveUp();
    }
    if (screen.input.isKeyDown("ArrowDown")) {
      state.moveDown();
    }

    screen.text.putCharacter("X");

    screen.render();

    requestAnimationFrame(loop);
  };
};

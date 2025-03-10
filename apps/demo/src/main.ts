import { colorBars } from "./colorBars";
import { textInput } from "./textInput";

import "./style.css";

import { Screen } from "@prizmjs/prizm";

const canvas = document.getElementById("screen") as HTMLCanvasElement;
canvas.onclick = () => {
  // Toggle fullscreen
  // if (canvas.requestFullscreen) {
  //   canvas.requestFullscreen();
  // }
};

const screen = new Screen(canvas, {
  width: 256,
  height: 192,
  element: { width: 8, height: 8 },
});

screen.loadFont("./fonts/cga.png", {
  name: "cga",
  characterWidth: 8,
  characterHeight: 8,
  margin: [0, 1, 1, 0],
});

// colorBars(screen)(0);

textInput(screen)(0);

import "./style.css";
import { BeepFxType, loadProject } from "@prizmjs/bfx";
import type { Effect } from "@prizmjs/bfx";
import { SquareWaveOscillator } from "./squareWave";
import { NoiseGenerator } from "./noiseGenerator";

function unlockAudioContext(audioCtx: AudioContext) {
  if (audioCtx.state !== "suspended") return;
  const b = document.body;
  const events = ["touchstart", "touchend", "mousedown", "keydown"];

  for (const e of events) {
    b.addEventListener(e, unlock, false);
  }
  function unlock() {
    audioCtx.resume().then(clean);
  }
  function clean() {
    for (const e of events) {
      b.removeEventListener(e, unlock);
    }
  }
}
const FRAME_RATE = 50;
const FRAME_TIME = 1000 / FRAME_RATE;

const playButton = document.getElementById("play") as HTMLButtonElement;
const selectList = document.getElementById("sample") as HTMLSelectElement;

playButton.addEventListener("click", () => {
  const effectName = selectList.value;
  const effect = effectBank.get(effectName);
  if (effect) {
    playEffect(effect);
  }
});

const demo1 = await fetch("audio/demo.spj").then((res) => res.text());
const { effectBank } = loadProject(demo1);

for (const [name] of effectBank) {
  const option = document.createElement("option");
  option.value = name;
  option.text = name;
  selectList.appendChild(option);
}

console.log(effectBank);

const audioCtx = new AudioContext();
unlockAudioContext(audioCtx);

const squareWave = new SquareWaveOscillator(audioCtx);
squareWave.connect(audioCtx.destination);

const noise = new NoiseGenerator(audioCtx);
noise.connect(audioCtx.destination);

squareWave.start();
noise.start();

noise.setVolume(0);
squareWave.setVolume(0);

function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

async function playEffect(effect: Effect) {
  for (const frame of effect.frames) {
    for (let j = 0; j < frame.params.frames; j++) {
      switch (frame.params.type) {
        case BeepFxType.Tone:
          noise.setVolume(0);

          squareWave.setVolume(1);
          squareWave.setFrequency(
            frame.params.tonePitch + frame.params.tonePitchSlide * j,
          );
          squareWave.setDutyCycle(
            frame.params.duty + frame.params.dutySlide * j,
          );
          break;
        case BeepFxType.Noise:
          squareWave.setVolume(0);

          noise.setVolume(1);
          noise.setPitch(
            frame.params.noisePitch + frame.params.noisePitchSlide * j,
          );
          break;
      }
      await wait(FRAME_TIME);
    }
  }
  squareWave.setVolume(0);
  noise.setVolume(0);
}

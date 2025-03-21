export enum BeepFxType {
  Tone = 0,
  Noise = 1,
  Pause = 2,
  Sample = 3,
}

const effectParams = [
  "type",
  "frames",
  "frameLen",
  "tonePitch",
  "tonePitchSlide",
  "noisePitch",
  "noisePitchSlide",
  "duty",
  "dutySlide",
  "samplePitch",
  "sampleNumber",
  "sampleOffset",
] as const;

type EffectParams = {
  type: BeepFxType;
  frames: number;
  frameLen: number;

  tonePitch: number;
  tonePitchSlide: number;
  noisePitch: number;
  noisePitchSlide: number;
  duty: number;
  dutySlide: number;

  sampleNumber: number;
  samplePitch: number;
  sampleOffset: number;
};

export class Effect {
  name: string;
  frames: Frame[];
  constructor(name: string, frames: Frame[]) {
    this.name = name;
    this.frames = frames;
  }
}

class Frame {
  params: EffectParams;
  constructor(params: number[]) {
    this.params = effectParams.reduce((acc, key, i) => {
      acc[key] = params[i];
      return acc;
    }, {} as EffectParams);
  }
}

class EffectBank extends Map<string, Effect> {}

export function loadProject(spj: string) {
  // Break spj at every whitespace or line break
  const spjArray = spj.split(/\s+/);

  // Check header
  if (spjArray.shift() !== "SoundEffectsProjectV2") {
    throw new Error("Invalid header");
  }

  // Read number of effects
  const nextLine = spjArray.shift();
  if (nextLine === undefined) {
    throw new Error("No number of effects found");
  }
  const numEffects = Number.parseInt(nextLine);

  const effectBank = new EffectBank();
  const samples = [];

  for (let i = 0; i < numEffects; i++) {
    const effectName = spjArray.shift()?.replace(/~/g, " ");
    const nextLine = spjArray.shift();
    const frames = [];

    if (effectName === undefined) {
      throw new Error("No effect name found");
    }
    if (nextLine === undefined) {
      throw new Error("No number of chunks found");
    }

    const numberOfFrames = Number.parseInt(nextLine);

    for (let j = 0; j < numberOfFrames; j++) {
      const frame = [];
      for (let k = 0; k < effectParams.length; k++) {
        const nextLine = spjArray.shift();
        if (nextLine === undefined) {
          throw new Error("No parameter found");
        }
        frame.push(Number.parseInt(nextLine));
      }
      frames.push(new Frame(frame));
    }
    const effect = new Effect(effectName, frames);
    effectBank.set(effectName, effect);
  }

  while (spjArray.length > 0) {
    const sampleLength = Number.parseInt(spjArray.shift() ?? "0");
    if (Math.sign(sampleLength) !== 1) {
      continue;
    }
    const samplePitch = Number.parseInt(spjArray.shift() ?? "");
    const sampleName = spjArray.shift()?.replace(/~/g, " ");
    const sampleData = new Uint8Array(sampleLength);
    for (let i = 0; i < sampleLength; i++) {
      sampleData[i] = Number.parseInt(spjArray.shift() ?? "");
    }
    const sample = { sampleName, samplePitch, sampleData };
    samples.push(sample);
  }

  return { effectBank, samples };
}

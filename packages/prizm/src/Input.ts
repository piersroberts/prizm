export class Input {
  keys: Set<string>;
  inputBuffer: string;
  constructor() {
    this.keys = new Set();
    this.keyDown = this.keyDown.bind(this);
    this.keyUp = this.keyUp.bind(this);
    this.inputBuffer = "";

    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("keyup", this.keyUp);
  }
  keyDown(event: KeyboardEvent) {
    this.keys.add(event.key);

    if (event.key === "Backspace") {
      this.inputBuffer = this.inputBuffer.slice(0, -1);
    } else {
      this.inputBuffer += event.key;
    }
  }
  keyUp(event: KeyboardEvent) {
    this.keys.delete(event.key);
  }
  isKeyDown(key: string) {
    return this.keys.has(key);
  }

  reset() {
    this.inputBuffer = "";
  }

  destroy() {
    window.removeEventListener("keydown", this.keyDown);
    window.removeEventListener("keyup", this.keyUp);
  }
}

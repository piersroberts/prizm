export class SquareWaveOscillator {
  audioContext: AudioContext;
  frequency: number;
  dutyCycle: number;
  gainNode: GainNode;
  customWaveform: PeriodicWave;
  oscillator: null | OscillatorNode;
  constructor(audioContext: AudioContext, frequency = 440, dutyCycle = 0.5) {
    this.audioContext = audioContext;
    this.frequency = frequency;
    this.dutyCycle = dutyCycle;
    this.gainNode = this.audioContext.createGain();
    this.customWaveform = this.audioContext.createPeriodicWave(
      new Float32Array([0, 1]), // Real (sine components)
      new Float32Array([0, 0]), // Imaginary (cosine components)
    );
    this.oscillator = null;
  }

  start() {
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.setPeriodicWave(this.customWaveform);
    this.oscillator.frequency.setValueAtTime(
      this.frequency,
      this.audioContext.currentTime,
    );

    const pulseGain = this.audioContext.createGain();
    pulseGain.gain.setValueAtTime(0, this.audioContext.currentTime);

    const interval = 1 / this.frequency;
    const onTime = interval * this.dutyCycle;

    const startTime = this.audioContext.currentTime;

    for (let i = 0; i < 100; i++) {
      const time = startTime + i * interval;
      pulseGain.gain.setValueAtTime(1, time); // High phase
      pulseGain.gain.setValueAtTime(0, time + onTime); // Low phase
    }

    this.oscillator.connect(pulseGain).connect(this.gainNode);
    this.oscillator.start();
  }

  stop() {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
    }
  }

  connect(destination: AudioNode) {
    this.gainNode.connect(destination);
  }

  // Set frequency in Hz between 20 and 20000. If value is out of range, it will be wrapped around.
  setFrequency(value: number) {
    // Handle value wrapping around, ensuring it stays within 20-20000 range
    const wrappedValue = ((Math.floor(value) % 20001) + 20001) % 20001;
    this.frequency = 20 + (wrappedValue / 20000) * 19980;

    if (this.oscillator) {
      this.oscillator.frequency.setValueAtTime(
        this.frequency,
        this.audioContext.currentTime,
      );
    }
  }

  setDutyCycle(value: number) {
    // Handle value wrapping around, ensuring it stays within 0-255 range
    const wrappedValue = ((Math.floor(value) % 256) + 256) % 256;
    this.dutyCycle = 0.01 + (wrappedValue / 255) * 0.98;

    if (this.oscillator) {
      const pulseGain = this.oscillator.context.createGain();
      pulseGain.gain.cancelScheduledValues(this.audioContext.currentTime);

      const interval = 1 / this.frequency;
      const onTime = interval * this.dutyCycle;
      const startTime = this.audioContext.currentTime;

      // Schedule new duty cycle pattern
      for (let i = 0; i < 100; i++) {
        const time = startTime + i * interval;
        pulseGain.gain.setValueAtTime(1, time); // High phase
        pulseGain.gain.setValueAtTime(0, time + onTime); // Low phase
      }

      // Reconnect with new gain node
      this.oscillator.disconnect();
      this.oscillator.connect(pulseGain).connect(this.gainNode);
    }
  }

  setVolume(volume: number) {
    this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
  }
}

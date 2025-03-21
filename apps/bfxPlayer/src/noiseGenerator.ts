export class NoiseGenerator {
  audioContext: AudioContext;
  pitch: number;
  noiseSource: AudioBufferSourceNode;
  filter: BiquadFilterNode;
  gainNode: GainNode;

  // Define frequency range constants
  private static readonly MIN_FREQUENCY = 200; // Hz (audible low frequency)
  private static readonly MAX_FREQUENCY = 8000; // Hz (audible high frequency)

  constructor(audioContext: AudioContext, pitch = 128) {
    this.audioContext = audioContext;
    this.pitch = pitch;

    this.noiseSource = this.audioContext.createBufferSource();
    this.filter = this.audioContext.createBiquadFilter();
    this.gainNode = this.audioContext.createGain();

    // Create noise buffer
    const bufferSize = this.audioContext.sampleRate * 2; // 2 seconds of noise
    const noiseBuffer = this.audioContext.createBuffer(
      1,
      bufferSize,
      this.audioContext.sampleRate,
    );
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1; // White noise
    }

    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;

    // Filter setup for pitch control
    this.filter.type = "bandpass"; // Focuses on a specific frequency range
    this.filter.frequency.setValueAtTime(
      this.mapPitchToFrequency(this.pitch),
      this.audioContext.currentTime,
    );
    this.filter.Q.setValueAtTime(10, this.audioContext.currentTime); // Narrower bandwidth for sharper pitch

    // Connect nodes
    this.noiseSource.connect(this.filter).connect(this.gainNode);
  }

  // Map 0-255 range to audible frequency range
  private mapPitchToFrequency(pitchValue: number): number {
    // Ensure pitch is within 0-255 range
    const normalizedPitch = Math.max(0, Math.min(255, pitchValue));

    // Map 0-255 to MIN_FREQUENCY-MAX_FREQUENCY using exponential mapping for more natural pitch perception
    return (
      NoiseGenerator.MIN_FREQUENCY *
      (NoiseGenerator.MAX_FREQUENCY / NoiseGenerator.MIN_FREQUENCY) **
        (normalizedPitch / 255)
    );
  }

  start() {
    this.noiseSource.start();
  }

  stop() {
    this.noiseSource.stop();
  }

  connect(destination: AudioNode) {
    this.gainNode.connect(destination);
  }

  setPitch(value: number) {
    this.pitch = value;
    const frequency = this.mapPitchToFrequency(value);
    this.filter.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime,
    );
  }

  setVolume(volume: number) {
    this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
  }
}

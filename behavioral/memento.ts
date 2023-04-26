// https://en.wikipedia.org/wiki/Memento_pattern

import { clamp } from "../lib/math.ts";
import presets from "../data/equalizer_presets.json" assert { type: "json" };

type Memento = () => void;

export class Equalizer {
  #scale: number;
  #settings: Array<number>;

  constructor(n: number, scale: number) {
    this.#scale = scale;
    this.#settings = new Array(n).fill(0);
  }

  #check_index(index: number): number {
    if (index < 0 || index >= this.#settings.length) {
      throw new Error(`invalid setting index: ${index}`);
    }
    return index;
  }

  #check_length(values: number[]): number[] {
    if (values.length != this.#settings.length) {
      throw new Error(
        `expected ${this.#settings.length} values, but got ${values.length}`,
      );
    }
    return values;
  }

  #percent_to_level(percent: number): number {
    return percent * this.#scale;
  }

  #level_to_percent(level: number): number {
    return level / this.#scale;
  }

  #clamp_level(level: number): number {
    return clamp(level, -this.#scale, this.#scale);
  }

  get scale(): number {
    return this.#scale;
  }

  get size(): number {
    return this.#settings.length;
  }

  getLevel(index: number): number {
    return this.#percent_to_level(this.#settings[this.#check_index(index)]);
  }

  getLevels(): number[] {
    return this.#settings.map((percent) => this.#percent_to_level(percent));
  }

  setLevel(index: number, level: number) {
    this.#settings[this.#check_index(index)] = this.#level_to_percent(
      this.#clamp_level(level),
    );
  }

  setLevels(...levels: number[]) {
    this.#settings = this.#check_length(levels).map((level) =>
      this.#level_to_percent(this.#clamp_level(level))
    );
  }

  remember(values: number[]): Memento {
    const backup = [...this.#check_length(values)];
    return () => {
      this.#settings = backup;
    };
  }

  save(): Memento {
    return this.remember(this.#settings);
  }
}

export class EqualizerPresets {
  #equalizer: Equalizer;
  #presets: Map<string, Memento>;

  constructor(equalizer: Equalizer, defaults: Record<string, number[]>) {
    this.#equalizer = equalizer;
    this.#presets = new Map();
    for (const [name, levels] of Object.entries(defaults)) {
      this.#presets.set(name, this.#equalizer.remember(levels));
    }
  }

  names(): IterableIterator<string> {
    return this.#presets.keys();
  }

  save(name: string) {
    this.#presets.set(name, this.#equalizer.save());
  }

  set(name: string) {
    const restore = this.#presets.get(name);
    if (restore === undefined) {
      throw new Error(`invalid preset: ${name}`);
    }
    restore();
  }
}

export class AudioPlayer {
  equalizer: Equalizer;
  equalizer_presets: EqualizerPresets;

  constructor() {
    // A 10-band equalizer, adjustable to +/-12db.
    this.equalizer = new Equalizer(10, 12);
    // Presets converted from the original winamp equalizer:
    // https://github.com/eladkarako/Winamp-Original-Presets
    this.equalizer_presets = new EqualizerPresets(this.equalizer, presets);
  }
}

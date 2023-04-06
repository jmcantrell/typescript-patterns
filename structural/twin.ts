// https://en.wikipedia.org/wiki/Twin_pattern

export type Update = () => void;

export class Twin<T> {
  value: T;
  update: Update;

  constructor(initial: T, update: Update) {
    this.value = initial;
    this.update = update;
  }

  set(value: T) {
    this.value = value;
    this.update();
  }

  static pair<T>(initial: T): [Twin<T>, Twin<T>] {
    const a: Twin<T> = new Twin(initial, () => b.value = a.value);
    const b: Twin<T> = new Twin(initial, () => a.value = b.value);
    return [a, b];
  }
}

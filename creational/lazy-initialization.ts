export class Lazy<T> {
  #initializer: () => T;
  #value?: T;

  constructor(initializer: () => T) {
    this.#initializer = initializer;
  }

  get value(): T {
    if (typeof this.#value === "undefined") {
      this.#value = this.#initializer();
    }
    return this.#value;
  }
}

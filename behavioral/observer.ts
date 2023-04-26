// https://en.wikipedia.org/wiki/Observer_pattern

type EmptyFunction = () => void;
export type Observer<T> = (value: T) => void;
export type Unsubscriber = EmptyFunction;

export class Subject<T> {
  #value: T;
  #observers: Set<Observer<T>>;

  constructor(initial: T) {
    this.#value = initial;
    this.#observers = new Set();
  }

  get(): T {
    return this.#value;
  }

  set(value: T) {
    this.#value = value;
    this.notify();
  }

  subscribe(observer: Observer<T>): Unsubscriber {
    this.#observers.add(observer);
    observer(this.#value);
    return () => {
      this.#observers.delete(observer);
    };
  }

  notify() {
    for (const observer of this.#observers) {
      observer(this.#value);
    }
  }
}

// https://en.wikipedia.org/wiki/Adapter_pattern#Object_adapter_pattern

export interface Config {
  get: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
}

export class JsonConfig implements Config {
  #data: Record<string, string>;

  constructor(s: string) {
    this.#data = JSON.parse(s);
  }

  get(key: string): string | undefined {
    return this.#data[key];
  }

  set(key: string, value: string) {
    this.#data[key] = value;
  }
}

export class MapConfig implements Config {
  #data: Map<string, string>;

  constructor(map: Map<string, string>) {
    this.#data = map;
  }

  get(key: string): string | undefined {
    return this.#data.get(key);
  }

  set(key: string, value: string) {
    this.#data.set(key, value);
  }
}

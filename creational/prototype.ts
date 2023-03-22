export enum Nucleotide {
  Guanine = "G",
  Adenine = "A",
  Cytosine = "C",
  Thymine = "T",
}

const nucleotideLookup = Object.fromEntries(
  Object.values(Nucleotide).map((value) => [value as string, value]),
);

export function parseNucleotideSequence(s: string): Array<Nucleotide> {
  const sequence = [];
  s = s.toUpperCase();
  for (let i = 0; i < s.length; i++) {
    const c = s.charAt(i);
    const value = nucleotideLookup[c];
    if (value === undefined) {
      throw new TypeError(`invalid nucleotide at index ${i}: ${c}`);
    }
    sequence.push(value);
  }
  return sequence;
}

function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    const clone = new Date();
    clone.setTime(obj.getTime());
    return clone as T;
  }

  if (obj instanceof Map) {
    return new Map(obj) as T;
  }

  if (obj instanceof Set) {
    return new Set(obj) as T;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (obj instanceof Object) {
    const clone = Object.create(Object.getPrototypeOf(obj));
    const descriptors = Object.getOwnPropertyDescriptors(obj);

    for (const [name, descriptor] of Object.entries(descriptors)) {
      clone[name] = deepClone(descriptor.value);
    }

    return clone;
  }

  throw new TypeError(`unknown object type: ${typeof obj}`);
}

export class Chromosome {
  sequence: Array<Nucleotide>;

  constructor(s: string) {
    this.sequence = parseNucleotideSequence(s);
  }

  splice(start: number, deleteCount: number, s: string) {
    this.sequence.splice(start, deleteCount, ...parseNucleotideSequence(s));
  }

  toString(): string {
    return this.sequence.map((nucleotide) => nucleotide).join("");
  }

  clone(): Chromosome {
    return deepClone(this);
  }
}

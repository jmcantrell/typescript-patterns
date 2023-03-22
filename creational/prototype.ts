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
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (obj && typeof obj === "object") {
    const clone = Object.create(Object.getPrototypeOf(obj));
    const descriptors = Object.getOwnPropertyDescriptors(obj);

    for (const [name, descriptor] of Object.entries(descriptors)) {
      if (descriptor.value && typeof descriptor.value === "object") {
        clone[name] = deepClone(descriptor.value);
      } else {
        clone[name] = descriptor.value;
      }
    }

    return clone as T;
  }

  return obj;
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

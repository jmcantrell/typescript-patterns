export interface Reader {
  read: () => string;
}

export class Decoder<T> implements Reader {
  input: T;

  constructor(input: T) {
    this.input = input;
  }

  decode(): string {
    throw new Error("not implemented");
  }

  read(): string {
    return this.decode();
  }
}

export class Base64Decoder extends Decoder<string> implements Reader {
  decode(): string {
    return atob(this.input);
  }
}

export class ByteDecoder extends Decoder<Uint8Array> implements Reader {
  decode(): string {
    return new TextDecoder().decode(this.input);
  }
}

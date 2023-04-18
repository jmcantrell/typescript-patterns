// https://en.wikipedia.org/wiki/Interpreter_pattern
// https://en.wikipedia.org/wiki/Brainfuck

import { enumerate, flatten, groupBy, map } from "../lib/iter.ts";

export type Location = number;
export type Span = [Location, Location];

export class Token {
  span: Span;

  constructor(span: Span) {
    this.span = span;
  }

  length(): number {
    const [start, end] = this.span;
    return end - start + 1;
  }

  marker(): string {
    throw new Error("unimplemented");
  }

  toString(): string {
    return this.marker().repeat(this.length());
  }
}

export class KnownToken extends Token {
  static key: string;

  constructor(span: Span) {
    super(span);
  }

  marker(): string {
    return (this.constructor as typeof KnownToken).key;
  }
}

export class UnknownToken extends Token {
  key: string;

  constructor(span: Span, key: string) {
    super(span);
    this.key = key;
  }

  marker(): string {
    return this.key;
  }
}

export class MoveRightToken extends KnownToken {
  static key = ">";
}

export class MoveLeftToken extends KnownToken {
  static key = "<";
}

export class IncrementToken extends KnownToken {
  static key = "+";
}

export class DecrementToken extends KnownToken {
  static key = "-";
}

export class OutputToken extends KnownToken {
  static key = ".";
}

export class InputToken extends KnownToken {
  static key = ",";
}

export class LoopStartToken extends KnownToken {
  static key = "[";
}

export class LoopEndToken extends KnownToken {
  static key = "]";
}

export class Node {
  span: Span;
  children: Node[];

  constructor(span: Span, ...children: Node[]) {
    this.span = span;
    this.children = children;
  }

  *toTokens(): Generator<Token> {}

  toString(): string {
    return Array.from(this.toTokens()).join("");
  }
}

export class AmountNode extends Node {
  amount: number;

  constructor(span: Span, amount: number) {
    super(span);
    if (amount == 0) throw new Error("amount cannot be zero");
    this.amount = amount;
  }

  grow() {
    this.amount += this.amount / Math.abs(this.amount);
  }
}

export class MoveNode extends AmountNode {
  *toTokens(): Generator<Token> {
    yield new (this.amount < 0 ? MoveLeftToken : MoveRightToken)(this.span);
  }
}

export class AddNode extends AmountNode {
  *toTokens(): Generator<Token> {
    yield new (this.amount < 0 ? DecrementToken : IncrementToken)(this.span);
  }
}

export class LoopNode extends Node {
  *toTokens(): Generator<Token> {
    const [start, end] = this.span;
    yield new LoopStartToken([start, start]);
    for (const node of this.children) {
      yield* node.toTokens();
    }
    yield new LoopEndToken([end, end]);
  }
}

export class OutputNode extends Node {
  *toTokens(): Generator<Token> {
    yield new OutputToken(this.span);
  }
}

export class InputNode extends Node {
  *toTokens(): Generator<Token> {
    yield new InputToken(this.span);
  }
}

export class IgnoredNode extends Node {
  key: string;

  constructor(span: Span, key: string) {
    super(span);
    this.key = key;
  }

  *toTokens(): Generator<Token> {
    yield new UnknownToken(this.span, this.key);
  }
}

const knownTokenTypes: Array<typeof KnownToken> = [
  MoveRightToken,
  MoveLeftToken,
  IncrementToken,
  DecrementToken,
  OutputToken,
  InputToken,
  LoopStartToken,
  LoopEndToken,
];

const knownTokenTypesByKey = new Map<string, typeof KnownToken>();
knownTokenTypes.forEach((tokenType) =>
  knownTokenTypesByKey.set(tokenType.key, tokenType)
);

function* compress(tokens: Iterable<Token>): Generator<Token> {
  yield* map(
    groupBy(tokens, (token) => token.marker()),
    (group) => {
      if (group.length == 1) {
        return group[0];
      } else {
        const first = group[0];
        const last = group.at(-1)!;
        first.span[1] = last.span[1];
        return first;
      }
    },
  );
}

function* decompress(tokens: Iterable<Token>): Generator<Token> {
  for (const token of tokens) {
    const [start, end] = token.span;
    for (let location = start; location <= end; location++) {
      yield parseToken(token.marker(), [location, location]);
    }
  }
}

function parseToken(key: string, span: Span): Token {
  const tokenType = knownTokenTypesByKey.get(key);
  return tokenType ? new tokenType(span) : new UnknownToken(span, key);
}

export function* tokenize(input: string): Generator<Token> {
  yield* compress(
    map(
      enumerate(input),
      ([location, key]) => parseToken(key, [location, location]),
    ),
  );
}

export function format(tokens: Iterable<Token>): string {
  return Array.from(tokens).join("");
}

export function* emit(nodes: Iterable<Node>): Generator<Token> {
  yield* compress(flatten(map(nodes, (node) => node.toTokens())));
}

export function parse(tokens: Iterable<Token>): Node[] {
  const iter = decompress(tokens)[Symbol.iterator]();

  function recurse(iter: Iterator<Token>): [Node[], Token | null] {
    const nodes: Node[] = [];
    let lastToken: Token | null = null;

    while (true) {
      const { value: token, done } = iter.next();

      if (done || token instanceof LoopEndToken) {
        return [nodes, token];
      }

      if (token instanceof LoopStartToken) {
        const [children, nextToken] = recurse(iter);
        const start = token.span[0];
        const end = nextToken?.span[0] || start;
        if (!nextToken || !(nextToken instanceof LoopEndToken)) {
          throw new Error(`missing loop end for: ${start}`);
        }
        const span: Span = [start, end];
        nodes.push(new LoopNode(span, ...children));
        lastToken = null;
        continue;
      }

      // Detect if the current token can be merged with the previous one.
      const redundant = lastToken && (
        (token instanceof MoveLeftToken &&
          lastToken instanceof MoveLeftToken) ||
        (token instanceof MoveRightToken &&
          lastToken instanceof MoveRightToken) ||
        (token instanceof DecrementToken &&
          lastToken instanceof DecrementToken) ||
        (token instanceof IncrementToken &&
          lastToken instanceof IncrementToken) ||
        token instanceof UnknownToken &&
          lastToken instanceof UnknownToken &&
          token.key == lastToken.key
      );

      if (redundant) {
        // Optimization: some operations can be done in bulk.
        // (e.g. 5 MoveLeftTokens can be compressed into one MoveNode(-5))
        const node = nodes.at(-1)!;
        node.span[1] = token.span[0];
        if (!(lastToken instanceof UnknownToken)) {
          (node as AmountNode).grow();
        }
      } else {
        if (token instanceof MoveLeftToken) {
          nodes.push(new MoveNode(token.span, -1));
        } else if (token instanceof MoveRightToken) {
          nodes.push(new MoveNode(token.span, 1));
        } else if (token instanceof DecrementToken) {
          nodes.push(new AddNode(token.span, -1));
        } else if (token instanceof IncrementToken) {
          nodes.push(new AddNode(token.span, 1));
        } else if (token instanceof InputToken) {
          nodes.push(new InputNode(token.span));
        } else if (token instanceof OutputToken) {
          nodes.push(new OutputNode(token.span));
        } else if (token instanceof UnknownToken) {
          nodes.push(new IgnoredNode(token.span, token.key));
        } else {
          throw new Error("unreachable");
        }
      }

      lastToken = token;
    }
  }

  const [nodes, left] = recurse(iter);

  if (left) throw new Error("invalid program");

  return nodes;
}

export class Process {
  pointer: number;
  program: Node[];
  memory: Uint8Array;
  inputIndex: number;
  inputBuffer: Array<number>;
  outputBuffer: Array<number>;

  constructor(program: Node[], input?: Array<number>) {
    this.pointer = 0;
    this.program = program;
    this.memory = new Uint8Array(30_000);
    this.inputIndex = 0;
    this.inputBuffer = input || [];
    this.outputBuffer = [];
  }

  input(): number {
    if (this.inputIndex >= this.inputBuffer.length) {
      throw new Error("unexpected end of input");
    }
    return this.inputBuffer[this.inputIndex++];
  }

  output() {
    this.outputBuffer.push(this.value());
  }

  value(): number {
    return this.memory[this.pointer];
  }

  #execute_loop(loop: Node[]) {
    while (this.value() != 0) {
      for (const node of loop) {
        this.#execute_node(node);
      }
    }
  }

  #execute_node(node: Node) {
    if (node instanceof LoopNode) {
      this.#execute_loop(node.children);
    } else if (node instanceof MoveNode) {
      this.pointer += node.amount;
    } else if (node instanceof AddNode) {
      this.memory[this.pointer] += node.amount;
    } else if (node instanceof InputNode) {
      this.memory[this.pointer] = this.input();
    } else if (node instanceof OutputNode) {
      this.output();
    } else if (node instanceof IgnoredNode) {
      return;
    } else {
      throw new Error(`invalid node: ${node}`);
    }
  }

  execute() {
    for (const node of this.program) {
      this.#execute_node(node);
    }
    return this;
  }
}

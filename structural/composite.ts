// https://en.wikipedia.org/wiki/Composite_pattern

export interface Component {
  render: () => string;
}

export class Text implements Component {
  text: string;

  constructor(text?: string) {
    this.text = text || "";
  }

  render(): string {
    return this.text;
  }
}

export class Container implements Component {
  children: Array<Component>;

  constructor(...children: Array<Component>) {
    this.children = children;
  }

  render(): string {
    return this.children.map((child) => child.render()).join("\n");
  }
}

export type Attributes = Record<string, string>;
export interface ElementOptions {
  attributes?: Attributes;
  child?: Component;
}

export class Element implements Component {
  tag: string;
  attributes: Attributes;
  child: Component;

  constructor(
    tag: string,
    options?: { attributes?: Attributes; child?: Component },
  ) {
    this.tag = tag;
    this.attributes = options?.attributes || {};
    this.child = options?.child || new Text();
  }

  render(): string {
    const attributes = Object.entries(this.attributes).map(
      ([key, value]) => `${key}="${value}"`,
    );
    return `<${this.tag}${
      attributes.length > 0 ? " " + attributes.join(" ") : ""
    }>${this.child.render()}</${this.tag}>`;
  }
}

export class Paragraph extends Element {
  constructor(text: string) {
    super("p", { child: new Text(text) });
  }
}

export class Heading extends Element {
  constructor(depth: number, text: string) {
    super(`h${depth + 1}`, { child: new Text(text) });
  }
}

export class Link extends Element {
  constructor(url: string, text: string) {
    super("a", { child: new Text(text), attributes: { href: url } });
  }
}

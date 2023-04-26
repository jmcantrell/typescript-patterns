// https://en.wikipedia.org/wiki/Abstract_factory_pattern

export interface Component {
  render: () => string;
}

export interface Link extends Component {
  label: string;
  target: string;
}

export interface Heading extends Component {
  depth: number;
  text: string;
}

export interface ComponentFactory {
  createLink: (label: string, target: string) => Link;
  createHeading: (level: number, text: string) => Heading;
}

export class MarkdownLink implements Link {
  label: string;
  target: string;

  constructor(label: string, target: string) {
    this.label = label;
    this.target = target;
  }

  render(): string {
    return `[${this.label}](${this.target})`;
  }
}

export class MarkdownHeading implements Heading {
  depth: number;
  text: string;

  constructor(depth: number, text: string) {
    this.depth = depth;
    this.text = text;
  }

  render(): string {
    return `${"=".repeat(this.depth + 1)} ${this.text}`;
  }
}

export class MarkdownFactory implements ComponentFactory {
  createLink(label: string, target: string): Link {
    return new MarkdownLink(label, target);
  }

  createHeading(depth: number, text: string): Heading {
    return new MarkdownHeading(depth, text);
  }
}

export class HtmlLink implements Link {
  label: string;
  target: string;

  constructor(label: string, target: string) {
    this.label = label;
    this.target = target;
  }

  render(): string {
    return `<a href="${this.target}">${this.label}</a>`;
  }
}

export class HtmlHeading implements Heading {
  depth: number;
  text: string;

  constructor(depth: number, text: string) {
    this.depth = depth;
    this.text = text;
  }

  render(): string {
    const n = this.depth + 1;
    return `<h${n}>${this.text}</h${n}>`;
  }
}

export class HtmlFactory implements ComponentFactory {
  createLink(label: string, target: string): Link {
    return new HtmlLink(label, target);
  }

  createHeading(depth: number, text: string): Heading {
    return new HtmlHeading(depth, text);
  }
}

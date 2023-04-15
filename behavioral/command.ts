// https://en.wikipedia.org/wiki/Command_pattern

export class Editor {
  #text: string;
  #selection: [number, number];

  constructor(text = "") {
    this.#text = text;
    this.#selection = [0, 0];
  }

  getText(): string {
    return this.#text;
  }

  setText(text: string) {
    this.#text = text;
  }

  getSelection(): [number, number] {
    return this.#selection;
  }

  setSelection(a: number, b = a) {
    this.#selection = a <= b ? [a, b] : [b, a];
  }

  getSelectedText(): string {
    return this.#text.slice(...this.#selection);
  }

  setSelectedText(text: string) {
    const [start, end] = this.#selection;
    this.#text = this.#text.slice(0, start) + text + this.#text.slice(end);
  }
}

export class Command {
  execute(_app: Application): boolean {
    return false;
  }

  undo() {}
}

export class DestructiveCommand extends Command {
  backup?: [Editor, string];

  execute(app: Application): boolean {
    const editor = app.buffers.active;
    this.backup = [editor, editor.getText()];
    return true;
  }

  undo() {
    if (!this.backup) return;
    const [editor, text] = this.backup;
    editor.setText(text);
  }
}

export class SelectAll extends Command {
  execute(app: Application): boolean {
    app.buffers.active.setSelection(0, Infinity);
    return false;
  }
}

export class Copy extends Command {
  execute(app: Application): boolean {
    app.clipboard = app.buffers.active.getSelectedText();
    return false;
  }
}

export class Cut extends DestructiveCommand {
  execute(app: Application): boolean {
    super.execute(app);
    const editor = app.buffers.active;
    app.clipboard = editor.getSelectedText();
    editor.setSelectedText("");
    return true;
  }
}

export class Paste extends DestructiveCommand {
  execute(app: Application): boolean {
    super.execute(app);
    app.buffers.active.setSelectedText(app.clipboard);
    return true;
  }
}

export class Undo extends Command {
  execute(app: Application): boolean {
    app.history.pop()?.undo();
    return false;
  }
}

export class Buffers {
  #editors: Editor[];
  #active: number;

  constructor() {
    this.#editors = [new Editor()];
    this.#active = 0;
  }

  add() {
    this.#editors.splice(this.#active + 1, 0, new Editor());
  }

  next() {
    this.#active += 1;
    if (this.#active >= this.#editors.length) this.#active = 0;
  }

  prev() {
    this.#active -= 1;
    if (this.#active < 0) this.#active = this.#editors.length - 1;
  }

  get active(): Editor {
    return this.#editors[this.#active];
  }
}

export class Application {
  buffers: Buffers;
  clipboard: string;
  history: Command[];
  buttons: Map<string, Command>;
  keyBindings: Map<string, Command[]>;

  constructor() {
    this.buffers = new Buffers();
    this.clipboard = "";
    this.history = [];
    this.buttons = new Map();
    this.keyBindings = new Map();
  }

  executeCommand(command: Command) {
    if (command.execute(this)) this.history.push(command);
  }

  setButton(key: string, command: Command) {
    this.buttons.set(key, command);
  }

  clickButton(key: string) {
    const command = this.buttons.get(key);
    if (!command) return;
    this.executeCommand(command);
  }

  addKeyBinding(key: string, command: Command) {
    if (!this.keyBindings.has(key)) {
      this.keyBindings.set(key, []);
    }
    this.keyBindings.get(key)!.push(command);
  }

  pressKey(key: string) {
    for (const command of this.keyBindings.get(key) || []) {
      this.executeCommand(command);
    }
  }
}

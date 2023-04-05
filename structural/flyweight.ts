// https://en.wikipedia.org/wiki/Flyweight_pattern

let id = 0;
const tree_images = new Map<string, string>();

export class Tree {
  kind: string;
  image: string;

  constructor(kind: string) {
    this.kind = kind;
    if (!tree_images.has(kind)) {
      tree_images.set(kind, `much data so expensive: ${++id}`);
    }
    this.image = tree_images.get(kind)!;
  }

  render(): string {
    return `${this.kind} tree: ${this.image}`;
  }
}

export class Forest {
  trees: Tree[];

  constructor() {
    this.trees = [];
  }

  plant_tree(kind: string) {
    this.trees.push(new Tree(kind));
  }

  render(): string {
    return this.trees.map((tree) => tree.render()).join("\n");
  }
}

export enum Flavor {
  Vanilla = "vanilla",
  Chocolate = "chocolate",
  Strawberry = "strawberry",
}

export enum Topping {
  Sprinkles = "sprinkles",
  HotFudge = "hot fudge",
  WhipCream = "whip cream",
}

export interface Dessert {
  build: () => string;
}

export class IceCreamDessert implements Dessert {
  scoops: Array<[Flavor, number]>;
  toppings: Array<Topping>;

  constructor() {
    this.scoops = [];
    this.toppings = [];
  }

  addScoops(flavor: Flavor, n: number) {
    this.scoops.push([flavor, n]);
    return this;
  }

  addTopping(topping: Topping) {
    this.toppings.push(topping);
    return this;
  }

  build(): string {
    const items = [];
    if (this.scoops.length > 0) {
      items.push(
        this.scoops.map(([flavor, n]) =>
          `${n} scoop${n > 1 ? "s" : ""} of ${flavor.toString()}`
        ).join(" and "),
      );
    }
    if (this.toppings.length > 0) {
      items.push(
        this.toppings.join(" and "),
      );
    }
    return items.join(" and ");
  }
}

export enum ConeType {
  Sugar = "sugar",
  Waffle = "waffle",
}

export class Cone extends IceCreamDessert {
  cone_type: ConeType;

  constructor(cone_type: ConeType) {
    super();
    this.cone_type = cone_type;
  }

  build(): string {
    const items = [`a ${this.cone_type.toString()} cone`];
    const contents = super.build();
    if (contents.length > 0) {
      items.push(contents);
    }
    return items.join(" with ");
  }
}

export class BananaSplit extends IceCreamDessert {
  banana_count: number;

  constructor(banana_count: number) {
    super();
    this.banana_count = banana_count;
  }

  build(): string {
    const items = [`a ${this.banana_count}-banana split`];
    const contents = super.build();
    if (contents.length > 0) {
      items.push(contents);
    }
    return items.join(" with ");
  }
}

export type Vector = [number, number];

export interface Polygon {
  area: () => number;
  perimeter: () => number;
}

export class Rectangle implements Polygon {
  top_left: Vector;
  size: Vector;

  constructor(top_left: Vector, size: Vector) {
    this.top_left = top_left;
    this.size = size;
  }

  area(): number {
    return this.size[0] * this.size[1];
  }

  perimeter(): number {
    return 2 * this.size[0] + 2 * this.size[1];
  }
}

export class Circle implements Polygon {
  center: Vector;
  radius: number;

  constructor(center: Vector, radius: number) {
    this.center = center;
    this.radius = radius;
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

export class Scaled implements Polygon {
  polygon: Polygon;
  factor: number;

  constructor(polygon: Polygon, factor: number) {
    this.polygon = polygon;
    this.factor = factor;
  }

  area(): number {
    return this.polygon.area() * this.factor;
  }

  perimeter(): number {
    return this.polygon.perimeter() * this.factor;
  }
}

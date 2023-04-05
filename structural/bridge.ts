// https://en.wikipedia.org/wiki/Bridge_pattern

export class Vec2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Shape {
  location: Vec2;
  color: string;

  constructor(location: Vec2, color: string) {
    this.location = location;
    this.color = color;
  }
}

export class Rectangle extends Shape {
  size: Vec2;

  constructor(location: Vec2, color: string, size: Vec2) {
    super(location, color);
    this.size = size;
  }
}

export class Circle extends Shape {
  radius: number;

  constructor(location: Vec2, color: string, radius: number) {
    super(location, color);
    this.radius = radius;
  }
}

export class Renderer {
  render_circle(_circle: Circle): string {
    throw new Error("not implemented");
  }

  render_rectangle(_rectangle: Rectangle): string {
    throw new Error("not implemented");
  }
}

export class SvgRenderer extends Renderer {
  render_circle(circle: Circle): string {
    const { color } = circle;
    const { x, y } = circle.location;
    return `<circle cx="${x}" cy="${y}" fill="${color}" r="${circle.radius}" />`;
  }

  render_rectangle(rectangle: Rectangle): string {
    const { color } = rectangle;
    const { x, y } = rectangle.location;
    const { x: width, y: height } = rectangle.size;
    return `<rect x="${x}" y="${y}" fill="${color}" width="${width}" height="${height}" />`;
  }
}

export class EnglishRenderer extends Renderer {
  render_circle(circle: Circle): string {
    const { radius, color } = circle;
    const { x, y } = circle.location;
    return `a ${color} circle with its center at x=${x} y=${y} and a radius of ${radius}`;
  }

  render_rectangle(rectangle: Rectangle): string {
    const { color } = rectangle;
    const { x, y } = rectangle.location;
    const { x: width, y: height } = rectangle.size;
    return `a ${color} rectangle with its top-left at x=${x} y=${y} and width=${width} height=${height}`;
  }
}

export class ShapeRenderer {
  shape: Shape;
  renderer: Renderer;

  constructor(shape: Shape, renderer: Renderer) {
    this.shape = shape;
    this.renderer = renderer;
  }

  render(): string {
    if (this.shape instanceof Circle) {
      return this.renderer.render_circle(this.shape);
    } else if (this.shape instanceof Rectangle) {
      return this.renderer.render_rectangle(this.shape);
    } else {
      throw new TypeError(`invalid shape: ${this.shape}`);
    }
  }
}

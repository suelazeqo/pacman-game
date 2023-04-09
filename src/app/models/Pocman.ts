export class Pacman {
  position: Position;
  velocity: Velocity;
  pressedKey: number;
  radius = 40;
  constructor({
                velocity,
                position,
                pressedKey,
                radius,
              }: {
    velocity: Velocity;
    position: Position;
    pressedKey: number;
    radius: number;
  }) {
    this.position = position;
    this.velocity = velocity;
    this.pressedKey = pressedKey;
    this.radius = radius;
  }

  draw(canvas: CanvasRenderingContext2D) {
    canvas.beginPath();
    canvas.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    canvas.fillStyle = 'yellow';
    canvas.fill();
    canvas.closePath();
  }

  update(canvas: CanvasRenderingContext2D) {
    this.draw(canvas);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

interface Position {
  x: number;
  y: number;
}

interface Velocity {
  x: number;
  y: number;
}







class Character {

  constructor(x, y, dx, dy, image) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.image = image;

    this.orientation = 1;

    this.targetX = 0;
    this.targetY = 0;
    this.moving = 0;
  }

  update() {
    push();
    imageMode(CENTER);

    if (this.moving == 1) {
      this.x += this.dx;
      this.y += this.dy;
    }

    console.log(this.x, this.y, this.targetX, this.targetY);

    if (this.x <= this.targetX + this.dx
    && this.x >= this.targetX - this.dx
    && this.y >= this.targetY + this.dy
    && this.y <= this.targetY - this.dy) {
      this.dx = 0;
      this.dy = 0;
      this.moving = 0;
    }

    image(this.image, this.x, this.y);

    pop();
  }







}

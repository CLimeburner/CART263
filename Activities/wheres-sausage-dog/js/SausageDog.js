class SausageDog extends Animal {
  constructor(x, y, image) {
    super(x, y, image); //calling Animal.js constructor

    this.found = false; //variable to track if dog has been clicked
    this.rotationSpeed = 0.25; //variable to provide a speed to rotate once clicked
  }

  update() {
    super.update(); //calls update from the Animal class

    //if sausage dog has been found, start spinning
    if (this.found) {
      this.angle += this.rotationSpeed; //increment by rotationSpeed
    }
  }

  mousePressed() {
    //check to see if click is over the sausage dog image
    if (mouseX > this.x - this.image.width / 2 &&
        mouseX < this.x + this.image.width / 2 &&
        mouseY > this.y - this.image.height / 2 &&
        mouseY < this.y + this.image.height2 {
        this.found = true; //set found to true
    }
  }
}

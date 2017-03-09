class Fly {
  constructor() {
    this.move();
  }

  move() {
    this.x = this.getNewX();
    this.y = this.getNewY();
  }

  getNewX() {
    return Math.round(Math.random() * 500); //TODO
  }

  getNewY() {
    return Math.round(Math.random() * 500); //TODO
  }
}
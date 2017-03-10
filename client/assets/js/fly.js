class Fly {
  constructor(flyWidth, flyHeight) {
    this.flyWidth = flyWidth;
    this.flyHeight = flyHeight;
    this.move();
  }

  move() {
    this.x = this.getNewX();
    this.y = this.getNewY();
  }

  getNewX() {
    const usableColumns = Math.floor(canvasWidth / this.flyWidth) - 2;

    return (Math.floor(Math.random() * usableColumns) + 1.5 ) * this.flyWidth; //TODO
  }

  getNewY() {
    const usableRows = Math.floor(canvasHeight / this.flyHeight) - 3;
    return (Math.floor(Math.random() * usableRows + 2 ) * this.flyHeight); //TODO
  }
}

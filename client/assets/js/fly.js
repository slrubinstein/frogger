class Fly {
  constructor(flyWidth, flyHeight) {
    this.move();
    this.flyWidth = flyWidth;
    this.flyHeight = flyHeight;
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
    const usableRows = Math.floor(canvasHeight / this.flyHeight) - 2;
    return (Math.floor(Math.random() * usableRows + 1.5 ) * this.flyHeight); //TODO
  }
}

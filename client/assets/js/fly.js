class Fly {
  constructor() {
    this.move();
  }

  move() {
    this.x = this.getNewX();
    this.y = this.getNewY();
  }

  getNewX() {
    const usableColumns = Math.floor(canvasWidth / frogWidth) - 2;

    return (Math.floor(Math.random() * usableColumns) + 1.5 ) * frogWidth; //TODO
  }

  getNewY() {
    const usableRows = Math.floor(canvasHeight / frogHeight) - 2;
    return (Math.floor(Math.random() * usableRows + 1.5 ) * frogHeight); //TODO
  }
}

class Player {
  constructor(up, down, left, right, startingX, startingY, height, width) {
    this.attachKeyListeners(up, down, left, right);

    this.height = height;
    this.width = width;

    this.posX = startingX;
    this.posY = startingY;
    this.flyX = this.getFlyX();
    this.flyY = this.getFlyY();

    this.lives = 3;
    this.score = 0;
    this.keyDownTimer;
  }

  getLives() {
    return this.lives;
  }

  attachKeyListeners(up, down, left, right) {
    document.addEventListener('keydown', (e) => {
      console.log(e.keyCode);
      if (!keyDownTimer) {
        this.keyDownTimer = setTimeout(() => this.keyDownTimer = null, 100);
        switch (e.keyCode) {
          case up:
            this.posY-=this.height;
            e.preventDefault();
            break;
          case down:
            this.posY+=this.height;
            e.preventDefault();
            break;
          case left:
            this.posX-=this.width;
            e.preventDefault();
            break;
          case right:
            this.posX+=this.width;
            e.preventDefault();
            break;
        }
      }
    });
  }

  getFlyX() {
    return Math.round(Math.random() * 500); //TODO
  }

  getFlyY() {
    return Math.round(Math.random() * 500); //TODO
  }

  detectCollision(context) {
    const data = context.getImageData(this.posX, this.posY, this.width, this.height).data;
    let sum = 0;
    for (let i=0; i<data.length; i+=8) {
      sum+=data[i];
    }
    return sum > 500;
  }

  detectFly() {
    return (Math.abs(this.posX - this.flyX) < this.width &&
      Math.abs(this.posY - this.flyY) < this.height);
  }

  loseLife() {
    this.lives--;
    setLives();

    if (lives <= 0) {
      gameOver();
      return;
    }
  }

  msgDiffWorker(context) {
    if (this.prevX && this.prevY && this.prevImage) {
      const currentImage = context.getImageData(this.prevX - 100, this.prevY - 100,
        200+this.width, 200+this.height).data;

      diffWorker.postMessage({
        'img1data': currentImage,
        'img2data': this.prevImage,
        'diff': ctx.createImageData(200+this.width, 200+this.height).data,
        'width': 200+this.width,
        'height': 200+this.width,
        'prevX': this.prevX,
        'prevY': this.prevY
      });
    }
    this.prevX = this.posX;
    this.prevY = this.posY;
    this.prevImage = context.getImageData(this.posX - 100, this.posY - 100,
      200+this.width, 200 + this.height).data;
  };

  tick(context) {
    this.msgDiffWorker(context);
    if (this.detectCollision(context)) {
      this.loseLife();
      splat.play();
    }

    if (this.detectFly()) {
      ribbit.play();
      this.flyX = this.getFlyX();
      this.flyY = this.getFlyY();
      this.score += 10;
    }
  }
}
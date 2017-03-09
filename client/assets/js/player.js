class Player {
  constructor(up, down, left, right, startingX, startingY, height, width) {
    this.attachKeyListeners(up, down, left, right);

    this.height = height;
    this.width = width;

    this.posX = this.startingX = startingX;
    this.posY = this.startingY = startingY;
    this.deadX = this.deadY = null;

    this.lives = 3;
    this.score = 0;
    this.keyDownTimer;
  }

  getLives() {
    return this.lives;
  }

  //TODO: Don't let people go off the screen!
  attachKeyListeners(up, down, left, right) {
    document.addEventListener('keydown', (e) => {
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

  detectCollision(context) {
    const data = context.getImageData(this.posX, this.posY, this.width, this.height).data;
    let sum = 0;
    for (let i=0; i<data.length; i+=8) {
      sum+=data[i];
    }
    return sum > 1000;
  }

  detectFly(fly) {
    return (Math.abs(this.posX - fly.x) < this.width &&
      Math.abs(this.posY - this.fly.y) < this.height);
  }

  loseLife() {
    this.lives--;
    setLives();

    this.deadX = this.posX;
    this.deadY = this.posY;
    this.posX = this.posY = null;

    setTimeout(() => {
      this.deadX = this.deadY = null
      this.posX = this.startingX;
      this.posY = this.startingY;
    }, 500)
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

  tick(fly) {
    this.msgDiffWorker();
    if (this.detectCollision()) {
      this.loseLife();
      splat.play();
    }

    if (this.detectFly(fly)) {
      ribbit.play();
      fly.move();
      this.score += 10;
    }
  }
}
const canvasHeight = 850, canvasWidth = 1800;

class Player {
  constructor(up, down, left, right, startingX, startingY, height, width, game) {
    this.up = up, this.down = down, this.left = left, this.right = right;
    this.game = game;
    this.height = height;
    this.width = width;

    this.posX = this.startingX = startingX;
    this.posY = this.startingY = startingY;
    this.deadX = this.deadY = null;

    this.lives = 1;
    this.score = 0;
    this.keyDownTimer = {};

    this.colDetect = true;
    setTimeout(() => this.colDetect = true, 1000);

    this.diffWorker = new Worker('assets/js/diffWorker.js');
    this.diffWorker.addEventListener('message', this.onDiffMessage.bind(this));
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    this.setTempInvincibility();
  }

  setTempInvincibility() {
    this.colDetect = false;
    setTimeout(() => this.colDetect = true, 1000);
  }

  destructor() {
    document.removeEventListener('keydown', onKeyDown)
  }

  onDiffMessage({ data }) {
    const imageData = new ImageData(data.diff, 200+this.width, 200+this.height);
    dctx.putImageData(imageData, data.prevX-100, data.prevY-100);
  }

  onKeyDown(e) {
    if (!this.keyDownTimer[e.keyCode]) {
      this.keyDownTimer[e.keyCode] = setTimeout(() => delete(this.keyDownTimer[e.keyCode]), 100);
      switch (e.keyCode) {
        case this.up:
          this.move('U');
          break;
        case this.down:
          this.move('D');
          break;
        case this.left:
          this.move('L');
          break;
        case this.right:
          this.move('R');
          break;
      }
    }
  }

  checkY(y) {
    if (y < canvasHeight - this.height && y > this.height) {
      return true;
    }
    return false;
  }

  checkX(x) {
    if (x < canvasWidth - this.width && x > this.height) {
      return true;
    }
    return false;
  }

  move(direction) {
    switch (direction) {
      case 'U':
        if (this.checkY(this.posY - this.height)) {
          this.posY -= this.height;
        }
        break;
      case 'D':
        if (this.checkY(this.posY + this.height)) {
          this.posY += this.height;
        }
        break;
      case 'L':
        if (this.checkX(this.posX - this.width)) {
          this.posX -= this.width;
        }
        break;
      case 'R':
        if (this.checkX(this.posX + this.width)) {
          this.posX += this.width;
        }
        break;
    }
  }

  detectCollision() {
    const data = dctx.getImageData(this.posX, this.posY, this.width, this.height).data;

    let sum = 0;
    for (let i=0; i<data.length; i+=8) {
      sum+=data[i];
    }
    return sum > 1000;
  }

  detectFly(fly) {
    return (Math.abs(this.posX - fly.x) < this.width &&
      Math.abs(this.posY - fly.y) < this.height);
  }

  loseLife() {
    this.lives--;
    this.game.setLives();

    this.deadX = this.posX;
    this.deadY = this.posY;
    this.posX = this.posY = null;

    setTimeout(() => {
      this.deadX = this.deadY = null
      this.posX = this.startingX;
      this.posY = this.startingY;
      this.setTempInvincibility();
    }, 500)
  }

  msgDiffWorker() {
    if (this.prevX && this.prevY && this.prevImage) {
      const currentImage = ctx.getImageData(this.prevX - 100, this.prevY - 100,
        200+this.width, 200+this.height).data;

      this.diffWorker.postMessage({
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
    this.prevImage = ctx.getImageData(this.posX - 100, this.posY - 100,
      200+this.width, 200 + this.height).data;
  };

  tick(fly) {
    this.msgDiffWorker();
    if (this.colDetect && this.detectCollision()) {
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

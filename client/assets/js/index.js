const canvas = document.getElementById('canvas'),
  gameCanvas = document.getElementById('gameCanvas'),
  finalScore = document.getElementById('finalScore'),
  diffCanvas = document.getElementById('diff'),
  body = document.querySelector('body'),
  gameLives = document.getElementById('gameLives');

const ctx = canvas.getContext('2d'),
  gctx = gameCanvas.getContext('2d'),
  dctx = diffCanvas.getContext('2d');

const w = 1800, h = 850;

gctx.mozImageSmoothingEnabled = false;
gctx.webkitImageSmoothingEnabled = false;
gctx.imageSmoothingEnabled = false;

class Game {
  constructor() {
    this.videoManager = new VideoManager(canvas, ctx);
    this.isGameOver = false;
    this.frogWidth = 60;
    this.frogHeight = 50;
    setUpDBListener(this);
  }

  startGame(isTwoPlayer) {
    this.isTwoPlayer = isTwoPlayer;

    if (isTwoPlayer) {
      this.players = [
        new Player(87, 83, 65, 68, w/3, h-100, this.frogHeight, this.frogWidth, this, 0),
        new Player(38, 40, 37, 39, 2*w/3, h-100, this.frogHeight, this.frogWidth, this, 1)
      ];
    } else {
      this.players = [
        new Player(38, 40, 37, 39, w/2-this.frogWidth/2, h-100, this.frogHeight, this.frogWidth, this, 0)
      ];
    }

    this.fly = new Fly(this.frogWidth, this.frogHeight);
    this.isGameOver = false;

    this.tick();
    this.players.forEach(this.paintLives, this);

    this.videoManager.restartVideo();

    trafficNoise.play();
  }

  tick() {
    this.players.forEach(player => player.tick(this.fly));
    this.drawGame();
    this.setScores();
    window.requestAnimationFrame(this.tick.bind(this));
  };

  paintLives(player) {
    const livesElement = document.querySelector(
        this.isTwoPlayer ? `#player${player.frogNum} .lives` : `#gameLives`);
    livesElement.innerHTML = '';

    for (let j =0; j < player.lives; j++) {
      let img = document.createElement('img');
      img.src = `assets/img/frog${player.frogNum}.png`;
      img.classList.add('life');
      livesElement.append(img);
    }
  }

  setScores() {
    this.players.forEach((player, i) => {
      const scoreElement = document.querySelector(
        this.isTwoPlayer ? `#player${i} .score` : `#gameScore #currentScore`);
      this.paintScore(player.score, scoreElement, finalScore)
    });
  }

  paintScore(score, scoreElement, finalElement) {
    scoreElement.innerHTML = parseInt(score, 10);
    finalElement.innerHTML = parseInt(score, 10);
    this.hiScore = Math.max(this.hiScore, parseInt(score, 10), 0);
    gameHiScore.innerHTML = this.hiScore;
  }

  displayHiScore(){ gameHiScore.innerHTML = this.hiScore; }

  drawGame() {
    gctx.clearRect(0,0,w,h);

    this.players.forEach((player, i) => {
      gctx.drawImage(frogs[player.frogNum], player.posX, player.posY, this.frogWidth, this.frogHeight);
      gctx.drawImage(deadFrogs[player.frogNum], player.deadX, player.deadY, this.frogWidth, this.frogHeight);
    });
    gctx.drawImage(flyImg, this.fly.x, this.fly.y, this.frogWidth, this.frogHeight);
  }

  setLives() {
    this.players.forEach((player, i) => {
      this.paintLives(player);

      if (player.lives <= 0) {
        this.players.splice(i, 1);
        gameOver(player, this);
        this.isGameOver = true;
      }
    });
  }
}

const game = new Game();

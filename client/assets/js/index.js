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

let JSMpegPlayer, video, videoMode = false;

gctx.mozImageSmoothingEnabled = false;
gctx.webkitImageSmoothingEnabled = false;
gctx.imageSmoothingEnabled = false;

startVideo = () => {
  var canvas = document.getElementById('canvas');
  // var url = 'ws://'+document.location.hostname+':8082/';
  var url = 'ws://104.131.119.113:8082/';
  JSMpegPlayer = new JSMpeg.Player(url, {
    canvas: canvas,
    disableGl: true,
    videoBufferSize: 1200 * 1200
  });
}

function switchToVideo(src) {
  if (video) {
    video.remove();
    video = null;
  } else {
    JSMpegPlayer.stop();
  }

  video = document.createElement('video');
  video.src = src;
  video.style.display = 'none';
  video.loop = true;
  document.body.appendChild(video);
  video.play();

  videoMode = true;
  videoTick();
}

function switchToLive() {
  videoMode = false;
  JSMpegPlayer.play();

  if (video) {
    video.remove();
    video = null;
  }
}

videoTick = () => {
  try {
    ctx.drawImage(video, 0, 0, w, h);
  } catch (e) {
    console.warn('video cannot be drawn to canvas', e);
  }

  if (videoMode) {
    window.requestAnimationFrame(videoTick);
  }
}

class Game {
  constructor() {
    startVideo();
    this.isGameOver = false;
    this.frogWidth = 60;
    this.frogHeight = 50;
  }

  startGame(isTwoPlayer) {
    this.isTwoPlayer = isTwoPlayer;

    if (isTwoPlayer) {
      this.players = [
        new Player(38, 40, 37, 39, 2*w/3, h-100, this.frogHeight, this.frogWidth, this),
        new Player(87, 83, 65, 68, w/3, h-100, this.frogHeight, this.frogWidth, this)
      ];
    } else {
      this.players = [
        new Player(38, 40, 37, 39, w/2-this.frogWidth/2, h-100, this.frogHeight, this.frogWidth, this)
      ];
    }

    this.fly = new Fly();
    this.isGameOver = false;

    this.paintLives();
    this.tick();

    if (videoMode && video) {
      video.pause();
      video.currentTime = 0;
      video.play();
    }
    trafficNoise.play();
  }

  tick() {
    this.players.forEach(player => player.tick(this.fly));
    this.setScores();
    this.drawGame();
    window.requestAnimationFrame(this.tick.bind(this));
  };

  paintLives() {
    this.players.forEach(player => {
      gameLives.innerHTML = '';

      for (let i =0; i < player.lives; i++) {
        let img = document.createElement('img');
        img.src = 'assets/img/frog0.png';
        img.classList.add('life');
        gameLives.append(img);
      }

      if (player.lives <= 0) {
        this.isGameOver = true;
        gameOver(this.score);
      }
    });
  }

  setScores() {
    this.players.forEach((player, i) => {
      const scoreElement = document.querySelector(
        this.isTwoPlayer ? `#player${i} .score` : `#gameScore`);
      this.paintScore(player.score, scoreElement, finalScore)
    });
  }

  paintScore(score, scoreElement, finalElement) {
    scoreElement.innerHTML = parseInt(score, 10);
    finalElement.innerHTML = parseInt(score, 10);
    this.hiScore = Math.max(this.hiScore, parseInt(this.score, 10));
    gameHiScore.innerHTML = this.hiScore;
  }

  displayHiScore(){ gameHiScore.innerHTML = this.hiScore; }

  drawGame() {
    gctx.clearRect(0,0,w,h);

    this.players.forEach((player, i) => {
      gctx.drawImage(frogs[i], player.posX, player.posY, this.frogWidth, this.frogHeight);
      gctx.drawImage(deadFrog, player.deadX, player.deadY, this.frogWidth, this.frogHeight);
    });
    gctx.drawImage(flyImg, this.fly.x, this.fly.y, this.frogWidth, this.frogHeight);
  }

  setLives() {
    this.players.forEach((player, i) => {
      const livesElement = document.querySelector(
        this.isTwoPlayer ? `#player${i} .lives` : `#gameLives`);
      livesElement.innerHTML = '';

      for (let j =0; j < player.lives; j++) {
        let img = document.createElement('img');
        img.src = `assets/img/frog${i}.png`;
        img.classList.add('life');
        livesElement.append(img);
      }

      if (player.lives <= 0) {
        gameOver();
        this.isGameOver = true;
      }
    });
  }
}

const game = new Game();
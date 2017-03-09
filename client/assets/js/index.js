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

let color, JSMpegPlayer, video;
let videoMode = false;

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
        new Player(38, 40, 37, 39, 2*w/3, h-100, this.frogHeight, this.frogWidth, this.onSetLives),
        new Player(87, 83, 65, 68, w/3, h-100, this.frogHeight, this.frogWidth, this.onSetLives)
      ];
    } else {
      this.players = [
        new Player(38, 40, 37, 39, w/2-this.frogWidth/2, h-100, this.rogHeight, this.frogWidth, this.onSetLives)
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
      let scoreElement = this.isTwoPlayer ? `#player${i} .score` : `#gameScore`;
      scoreElement = document.querySelector(scoreElement);
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

    if (color) {
      gctx.fillStyle = '#' + color[0][0].toString(16) + color[0][1].toString(16) + color[0][2].toString(16);
      gctx.fillRect(0,0,40,40);
      gctx.fillStyle = '#' + color[1][0].toString(16) + color[1][1].toString(16) + color[1][2].toString(16);
      gctx.fillRect(40,0,40,40);
    }

    this.players.forEach((player, i) => {
      gctx.drawImage(frogs[i], player.posX, player.posY, frogWidth, frogHeight);
      gctx.drawImage(deadFrog, player.deadX, player.deadY, frogWidth, frogHeight);
    });
    gctx.drawImage(flyImg, this.fly.x, this.fly.y, frogWidth, frogHeight);
  }
}

const game = new Game();
const canvas = document.getElementById('canvas'),
  game = document.getElementById('game'),
  gameHiScore = document.getElementById('hiScore'),
  finalScore = document.getElementById('finalScore'),
  diff = document.getElementById('diff'),
  body = document.querySelector('body'),
  gameLives = document.getElementById('gameLives'),
  diffWorker = new Worker('assets/js/diffWorker.js');

const ctx = canvas.getContext('2d'),
  gctx = game.getContext('2d'),
  dctx = diff.getContext('2d');

const frogWidth = 60, frogHeight = 50;
const w = 1800, h = 850;
const players = [];

let color;
let isGameOver = false;
let startTime = null,
  videoMode = false,
  JSMpegPlayer = null
  video = null;

gctx.mozImageSmoothingEnabled = false;
gctx.webkitImageSmoothingEnabled = false;
gctx.imageSmoothingEnabled = false;

let keyDownTimer = null;

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


init = () => {
  setLives();
  startVideo();
  displayHiScore();
};

displayHiScore = () => gameHiScore.innerHTML = hiScore;

startGame = (isTwoPlayer) => {
  if (isTwoPlayer) {
    players.push(new Player(38, 40, 37, 39, 2*w/3, h-100, frogHeight, frogWidth));
    players.push(new Player(87, 83, 65, 68, w/3, h-100, frogHeight, frogWidth));
  } else {
    players.push(new Player(38, 40, 37, 39, w/2-frogWidth/2, h-100, frogHeight, frogWidth));
  }

  setLives();
  if (!isGameOver) tick();
  isGameOver = false;

  if (videoMode && video) {
    video.pause();
    video.currentTime = 0;
    video.play();
  }
  trafficNoise.play();
}

tick = () => {
  if (startTime === null) {
    startTime = Date.now();
  }

  players.forEach(player => player.tick(dctx));

  setScores();
  drawGame();
  window.requestAnimationFrame(tick);
};

setLives = () => {
  players.forEach(player => {
    gameLives.innerHTML = '';

    for (let i =0; i < player.lives; i++) {
      let img = document.createElement('img');
      img.src = 'assets/img/frog.png';
      img.classList.add('life');
      gameLives.append(img);

      if (player.lives <= 0) {
        gameOver();
      }
    }
  });
}

setScores = () => {
  players.forEach((player, i) => {
    let scoreElement = players.length > 1 ? `#player${i} .score` : `#gameScore`;
    scoreElement = document.querySelector(scoreElement);
    setScore(player.score, scoreElement, finalScore)
  });
}

setScore = (score, scoreElement, finalElement) => {
  scoreElement.innerHTML = parseInt(score, 10);
  finalElement.innerHTML = parseInt(score, 10);
  hiScore = Math.max(hiScore, parseInt(score, 10));
  gameHiScore.innerHTML = hiScore;
}

onDiffMessage = ({ data }) => {
  const imageData = new ImageData(data.diff, 200+frogWidth, 200+frogHeight);
  dctx.putImageData(imageData, data.prevX-100, data.prevY-100);
};

drawGame = () => {
  gctx.clearRect(0,0,w,h);

  if (color) {
    gctx.fillStyle = '#' + color[0][0].toString(16) + color[0][1].toString(16) + color[0][2].toString(16);
    gctx.fillRect(0,0,40,40);
    gctx.fillStyle = '#' + color[1][0].toString(16) + color[1][1].toString(16) + color[1][2].toString(16);
    gctx.fillRect(40,0,40,40);
  }

  players.forEach(player => {
    gctx.drawImage(frog, player.posX, player.posY, frogWidth, frogHeight);
    gctx.drawImage(fly, player.flyX, player.flyY, frogWidth, frogHeight);
    gctx.drawImage(deadFrog, player.deadX, player.deadY, frogWidth, frogHeight);
  });
};

diffWorker.addEventListener('message', onDiffMessage);

init();

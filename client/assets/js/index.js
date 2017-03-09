const
  canvas = document.getElementById('canvas'),
  game = document.getElementById('game'),
  currentScore = document.getElementById('currentScore'),
  gameHiScore = document.getElementById('hiScore'),
  finalScore = document.getElementById('finalScore'),
  diff = document.getElementById('diff'),
  body = document.querySelector('body'),
  gameLives = document.getElementById('gameLives');

const ctx = canvas.getContext('2d'),
  gctx = game.getContext('2d'),
  dctx = diff.getContext('2d');

const frogWidth = 60,
  frogHeight = 50,
  w = 1800,
  h = 850,
  playableTop = h/8,
  playableBottom = h*7/8;

const ribbit = new Audio('assets/sounds/frog-ribbet2.wav'),
  splat = new Audio('assets/sounds/splat.wav'),
  horn = new Audio('assets/sounds/beep.wav'),
  startCar = new Audio('assets/sounds/StartCar.wav'),
  trafficNoise = new Audio('assets/sounds/traffic_noise.m4a'),
  diffWorker = new Worker('assets/js/diffWorker.js');

const frog = new Image(),
  fly = new Image(),
  deadFrog = new Image(),
  colorThief = new ColorThief();

let frogX, frogY, flyX, flyY, deadFrogX, deadFrogY;
let color, prevImage, prevFrogX, prevFrogY;
let lives = 3, score = 0, hiScore = 0, tickNo = 0;
let isGameOver = false;
let lastTick = Date.now(),
  startTime = null,
  videoMode = false,
  JSMpegPlayer = null
  video = null;

horn.volume = .5;
frog.src = 'assets/img/frog.png';
fly.src = 'assets/img/fly.gif';
deadFrog.src = 'assets/img/deadFrog.png';

gctx.mozImageSmoothingEnabled = false;
gctx.webkitImageSmoothingEnabled = false;
gctx.imageSmoothingEnabled = false;

let keyDownTimer = null;
trafficNoise.loop = true;

onKeyDown = (e) => {
  if (e.keyCode > 36 && e.keyCode < 41) {
    e.preventDefault();
    if (!keyDownTimer) {
      keyDownTimer = setTimeout(() => {
        keyDownTimer = null;
      }, 100);
      switch (e.keyCode) {
        case 38: newFrogPositionY(frogY - frogHeight); break;
        case 40: newFrogPositionY(frogY + frogHeight); break;
        case 37: newFrogPositionX(frogX - frogWidth); break;
        case 39: newFrogPositionX(frogX + frogWidth); break;
      }
    }
  }
};

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

drawVideoFrame = () => {
  try {
    ctx.drawImage(video, 0, 0, w, h);
  } catch (e) {
    console.warn('video cannot be drawn to canvas', e);
  }
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
  drawVideoFrame();

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

startGame = () => {
  lives = 3;
  setLives();
  setFrogToStartPosition();
  setFly();
  document.addEventListener('keydown', onKeyDown);
  if (!isGameOver) tick();
  isGameOver = false;

  if (videoMode && video) {
    video.pause();
    video.currentTime = 0;
    video.play();
  }
  trafficNoise.play();
}

setFly = () => {
  flyX = Math.round(Math.random() * w / frogWidth) * frogWidth + frogWidth/2;
  flyY = Math.round(Math.random() * ((playableBottom - playableTop) + playableTop) / frogHeight) * frogHeight;

}

setLives = () => {
  gameLives.innerHTML = '';

  for (let i =0; i < lives; i++) {
    let img = document.createElement('img');
    img.src = 'assets/img/frog.png';
    img.classList.add('life');
    gameLives.append(img);
  }
}

tick = () => {
  if (startTime === null) {
    startTime = Date.now();
  }

  tickNo++;
  const isSplat = detectCollision();
  const isDelicious = detectFly();

  if (isSplat) {
    loseLife();
    splat.play();
  }

  if (isDelicious) {
    ribbit.play();
    setFly();
    score += 10;
    setScore();
  }

  msgDiffWorker();

  drawGame();
  // console.log('FPS', 1 / ((performance.now() - lastTick) / 1000), tickNo / ((Date.now() - startTime) / 1000) );
  // console.log(tickNo);
  lastTick = performance.now();
  window.requestAnimationFrame(tick);
};

setScore = () => {
  currentScore.innerHTML = parseInt(score, 10);
  finalScore.innerHTML = parseInt(score, 10);
  hiScore = Math.max(hiScore, parseInt(score, 10));
  gameHiScore.innerHTML = hiScore;
}

setFrogToStartPosition = () => {
  frogX = w/2 - frogWidth/2;
  frogY = h - frogHeight;
}

loseLife = () => {
  lives--;

  setLives();
  setScore();
  deadFrogX = frogX;
  deadFrogY = frogY;

  if (lives <= 0) {
    gameOver();
    return;
  }

  frog.src = '';

  setTimeout(() => {
    frog.src = 'assets/img/frog.png';
    deadFrogX = null;
    deadFrogY = null;
  }, 500);
  setFrogToStartPosition();
}

msgDiffWorker = () => {
  if (prevFrogX && prevFrogY && prevImage) {
    const currentImage = ctx.getImageData(prevFrogX - 100, prevFrogY - 100, 200 + frogWidth, 200 + frogHeight).data;
    diffWorker.postMessage({
      'img1data': currentImage,
      'img2data': prevImage,
      'diff': ctx.createImageData(200+frogWidth, 200+frogHeight).data,
      'width': 200+frogWidth,
      'height': 200+frogWidth,
      'prevX': prevFrogX,
      'prevY': prevFrogY
    });
  }
  prevFrogX = frogX;
  prevFrogY = frogY;
  prevImage = ctx.getImageData(frogX - 100, frogY - 100, 200+frogWidth, 200 + frogHeight).data;
};

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

  gctx.drawImage(frog, frogX, frogY, frogWidth, frogHeight)
  gctx.drawImage(deadFrog, deadFrogX, deadFrogY, frogWidth, frogHeight)
  gctx.drawImage(fly, flyX, flyY, frogWidth, frogHeight)
};

diffWorker.addEventListener('message', onDiffMessage);

init();

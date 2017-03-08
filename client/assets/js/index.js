const
  // video = document.getElementById('videoElement'),
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

const frogWidth = 50,
  w = 1800,
  h = 850,
  frogHeight = 40,
  playableTop = h/8,
  playableBottom = h/4*3,
  fillColor = 'lime';

const ribbit = new Audio('assets/sounds/frog-ribbet2.wav'),
  splat = new Audio('assets/sounds/splat.wav'),
  horn = new Audio('assets/sounds/beep.wav'),
  startCar = new Audio('assets/sounds/StartCar.wav'),
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

frog.src = 'assets/img/frog.png';
fly.src = 'assets/img/fly.gif';

gctx.mozImageSmoothingEnabled = false;
gctx.webkitImageSmoothingEnabled = false;
gctx.imageSmoothingEnabled = false;

let frogX,
    frogY,
    frogWidth,
    frogHeight,
    flyX,
    flyY;

onKeyUp = (e) => {
  if (e.keyCode > 36 && e.keyCode < 41) {
    e.preventDefault();
    switch (e.keyCode) {
      case 38: newFrogPositionY(frogY - 30); break;
      case 40: newFrogPositionY(frogY + 30); break;
      case 37: newFrogPositionX(frogX - 30); break;
      case 39: newFrogPositionX(frogX + 30); break;
    }
  }
};

startVideo = () => {
  var canvas = document.getElementById('canvas');
  // var url = 'ws://'+document.location.hostname+':8082/';
  var url = 'ws://10.8.33.193:8082/';
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
  }

  video = document.createElement('video');
  video.src = src;
  video.style.visibility = 'hidden';
  document.body.appendChild(video);
  video.play();
  JSMpegPlayer.stop();

  videoMode = true;
  videoTick();
}

drawVideoFrame = () => {
  ctx.drawImage(video, 0, 0, w, h);
}

function switchToLive() {
  videoMode = false;
  if (video) {
    video.remove();
    video = null;
  }

  JSMpegPlayer.play();
  video.stop();
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
  frogX = w/2 - 25;
  frogY = h - 45;
  frogWidth = 70;
  frogHeight = 60;
  flyX = Math.random() * w;
  flyY = Math.random() * (playableBottom - playableTop) + playableTop;
  document.addEventListener('keyup', onKeyUp);
  if (!isGameOver) tick();
  isGameOver = false;
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
  }
  if (fillColor === 'lime' && isSplat) {
    fillColor = 'red';
    splat.play();
  } else if (fillColor === 'red' && !isSplat) {
    fillColor = 'lime';
  }

  if (isDelicious) {
    ribbit.play();
    flyX = Math.random() * w,
    flyY = Math.random() * (playableBottom - playableTop) + playableTop;
    score += 10;
    setScore();
  }

  msgDiffWorker();

  drawGame();
  console.log('FPS', 1 / ((performance.now() - lastTick) / 1000), tickNo / ((Date.now() - startTime) / 1000) );
  console.log(tickNo);
  lastTick = performance.now();
  window.requestAnimationFrame(tick);
};

setScore = () => {
  currentScore.innerHTML = parseInt(score, 10);
  finalScore.innerHTML = parseInt(score, 10);
  hiScore = Math.max(hiScore, parseInt(score, 10));
  gameHiScore.innerHTML = hiScore;
}

loseLife = () => {
  lives--;

  setLives();
  setScore();

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
  frogX = w/2 - 25;
  frogY = h - 50;
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

  gctx.fillStyle=fillColor;
  gctx.drawImage(frog, frogX, frogY, frogWidth, frogHeight)
  gctx.drawImage(fly, flyX, flyY, frogWidth, frogHeight)
};

diffWorker.addEventListener('message', onDiffMessage);

init();

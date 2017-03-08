let color, prevImage, prevFrogX, prevFrogY,
    w = 1200,
    h = 800,
    fillColor = 'lime',
    lives = 3,
    tickNo = 0,
    score = 0,
    hiScore = 0,
    isGameOver;

const
    // video = document.getElementById('videoElement'),
    canvas = document.getElementById('canvas'),
    game = document.getElementById('game'),
    currentScore = document.getElementById('currentScore'),
    gameHiScore = document.getElementById('hiScore'),
    finalScore = document.getElementById('finalScore'),
    diff = document.getElementById('diff'),
    frog = new Image(),
    fly = new Image(),
    body = document.querySelector('body'),
    gameLives = document.getElementById('gameLives'),
    ctx = canvas.getContext('2d'),
    gctx = game.getContext('2d'),
    dctx = diff.getContext('2d'),
    playableTop = h/8,
    playableBottom = h/4*3,
    ribbit = new Audio('assets/sounds/frog-ribbet2.wav'),
    splat = new Audio('assets/sounds/splat.wav'),
    horn = new Audio('assets/sounds/beep.wav'),
    startCar = new Audio('assets/sounds/StartCar.wav'),
    diffWorker = new Worker('assets/js/diffWorker.js'),
    colorThief = new ColorThief();

frog.src = 'assets/img/frog.png';
fly.src = 'assets/img/fly.gif';

ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

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

newFrogPositionX = (position) => {
  if (position >= 0 && position <= w) {
    frogX = position;
  }
}

newFrogPositionY = (position) => {
  if (position >= 0 && position <= h) {
    frogY = position;
  }
}

startVideo = () => {
  var canvas = document.getElementById('canvas');
  var url = 'ws://'+document.location.hostname+':8082/';
  var player = new JSMpeg.Player(url, {
    canvas: canvas,
    disableGl: true,
    videoBufferSize: 1200 * 1200
  });
}

init = () => {
  setLives();
  startVideo();
  displayHiScore();
};

displayHiScore = () => {
  gameHiScore.innerHTML = hiScore;
}

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
  if (!isGameOver) {
    tick();
  }
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

/**
 * This collision method works better when visibility is generally good and
 * the feed is stable
 */
detectCollision = () => {
  const data = dctx.getImageData(frogX, frogY, frogWidth, frogHeight).data;
  let sum = 0;
  for (let i=0; i<data.length; i+=8) {
    sum+=data[i];
  }
  return sum > 10000;
}

detectFly = () => {
  return (Math.abs(frogX - flyX) < 20 && Math.abs(frogY - flyY) < 20);
}

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

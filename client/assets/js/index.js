let color, prevImage,
    w = window.innerWidth,
    h = window.innerHeight,
    difficulty = 0,
    fillColor = 'lime',
    tickNo = 0,
    score = 0;

const
    // video = document.getElementById('videoElement'),
    canvas = document.getElementById('canvas'),
    game = document.getElementById('game'),
    gameScore = document.getElementById('gameScore'),
    diff = document.getElementById('diff'),
    frog = document.getElementById('frog'),
    fly = document.getElementById('fly'),
    body = document.querySelector('body'),
    ctx = canvas.getContext('2d'),
    gctx = game.getContext('2d'),
    dctx = diff.getContext('2d'),
    playableTop = h/8,
    playableBottom = h/4*3,
    ribbit = new Audio('assets/sounds/frog-ribbet2.wav'),
    splat = new Audio('assets/sounds/splat.wav'),
    diffWorker = new Worker('assets/js/diffWorker.js'),
    colorThief = new ColorThief();

let frogX = w/2 - 25,
    frogY = h - 50,
    frogWidth = 30,
    frogHeight = 30,
    flyX = Math.random() * w,
    flyY = Math.random() * (playableBottom - playableTop) + playableTop;

onKeyUp = (e) => {
  if (e.keyCode == '38') frogY-=30;
  else if (e.keyCode == '40') frogY+=30;
  else if (e.keyCode == '37') frogX-=30;
  else if (e.keyCode == '39') frogX+=30;
  e.preventDefault();
};

resize = () => {
  w = window.innerWidth;
  h = window.innerHeight;
  game.height = h;
  canvas.height = h;
  diff.height = h;
  game.width = w;
  canvas.width = w;
  diff.width = w;
};

startVideo = () => {
  var canvas = document.getElementById('canvas');
  var url = 'ws://'+document.location.hostname+':8082/';
  var player = new JSMpeg.Player(url, {
    canvas: canvas,
    disableGl: true
  });
}

init = () => {
  startVideo();
  resize();
  tick();
};

tick = () => {
  tickNo++;
  drawFrame();
  const isSplat = detectCollision();
  const isDelicious = detectFly();

  if (isSplat) {
    score = 0;
    gameScore.innerHTML = parseInt(score, 10);
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
    score += difficulty;
    gameScore.innerHTML = parseInt(score, 10);
  }
  if (!(tickNo % 3)) msgDiffWorker();
  if (!(tickNo % 20)) updateSwatch();

  drawGame();
  setTimeout(tick, 50);
};

msgDiffWorker = () => {
  const currentImage = ctx.getImageData(0, 0, w, h).data;
  if (prevImage) {
    diffWorker.postMessage({
      'img1data': currentImage,
      'img2data': prevImage,
      'diff': ctx.createImageData(w, h).data,
      'width': w,
      'height': h
    });
  }
  prevImage = currentImage;
};

onDiffMessage = ({ data }) => {
  const imageData = new ImageData(data.diff, w, h);
  dctx.putImageData(imageData, 0, 0)
  difficulty = (difficulty + data.difficulty * 40) / 2;
};

updateSwatch = () => {
  if (!canvas) return;
  const sampleCanvas = document.createElement('canvas');
  const sctx = sampleCanvas.getContext('2d');
  sctx.putImageData(
    ctx.getImageData(0,playableBottom,w,playableTop-playableBottom), 0, 0);
  color = colorThief.getPalette(sampleCanvas);
};

/**
 * This collision method works better when it is dark or there are long shadows
 */
// detectCollision = () => {
//   if (!color || frogY > playableBottom || frogY < playableTop) return false;

//   const data = ctx.getImageData(frogX, frogY, frogWidth, frogHeight).data;
//   let sum = 0;

//   for (let i=0; i<data.length; i+=8) {
//     let val = [];

//     for (let j=0; j<=1; j++) {
//       const rDiff = data[i] - color[j][0];
//       const gDiff = data[i+1] - color[j][1];
//       const bDiff = data[i+2] - color[j][2];
//       val[j] = Math.sqrt(rDiff**2 + gDiff**2 + bDiff**2);
//     }

//     sum += Math.min(val[0], val[1]);
//   }
//   return sum > 45000;
// };

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

drawFrame = () => {
  // ctx.drawImage(video, 0, 0, w, h);
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
  gctx.fillRect(0, playableBottom, w, 10); // start line
  gctx.fillRect(0, playableTop, w, 10); // stop line
  gctx.fillRect( 20, 10, difficulty, 30);
  gctx.drawImage(frog, frogX, frogY, frogWidth, frogHeight)
  gctx.drawImage(fly, flyX, flyY, frogWidth, frogHeight)
};

window.addEventListener('resize', resize);
document.addEventListener('keyup', onKeyUp);
// video.addEventListener('play', init, false);
diffWorker.addEventListener('message', onDiffMessage);

init();

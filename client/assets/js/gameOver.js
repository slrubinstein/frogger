const gameOverScreen = document.getElementById('gameOver');
const sadNoiseSignalingTheEndOfTheGame = new Audio('assets/sounds/game-over.mp3');
const database = firebase.database();

gameOver = () => {
  trafficNoise.pause();
  isGameOver = true;
  gameOverScreen.style.display = 'flex';
  frogX = null;
  frogY = null;
  sadNoiseSignalingTheEndOfTheGame.play();
  document.removeEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUpRestart);
}

onKeyUpRestart = (e) => {
  deadFrogX = null;
  deadFrogY = null;
  if (e.keyCode === 83 /* S */) {
    gameOverScreen.style.display = 'none';
    initMenu();
    score = 0;
    setScore();
    document.removeEventListener('keyup', onKeyUpRestart);
  }
}
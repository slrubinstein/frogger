const gameOverScreen = document.getElementById('gameOver');

gameOver = () => {
  isGameOver = true;
  gameOverScreen.style.display = 'flex';
  frogX = null;
  frogY = null;
  document.removeEventListener('keyup', onKeyUp);
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
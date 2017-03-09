const gameOverScreen = document.getElementById('gameOver');
const sadNoiseSignalingTheEndOfTheGame = new Audio('assets/sounds/game-over.mp3');
const hiScoresScreen = document.getElementById('hiScoresScreen');
const dbHiScores = document.getElementById('dbHiScores');
const dbRef = firebase.database().ref().child('dbHiScores');
const hiScores = [];

gameOver = () => {
  trafficNoise.pause();
  isGameOver = true;
  gameOverScreen.style.display = 'flex';
  frogX = null;
  frogY = null;
  sadNoiseSignalingTheEndOfTheGame.play();
  document.removeEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUpRestart);
  showSavedHiScores();
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

showSavedHiScores = () => {
  hiScoresScreen.style.display = 'block';
}

saveHiScore = (name, score) => {
  dbRef.push().set({
    name,
    score
  });
}


createScore = ({ name, score }) => {
  const container = document.createElement('div');
  const nameEl = document.createElement('span');
  nameEl.innerHTML = name;
  container.append(nameEl);
  const scoreEl = document.createElement('span');
  scoreEl.innerHTML = score;
  scoreEl.classList.add('dbHiScore');
  container.append(scoreEl);
  dbHiScores.append(container);
}

dbRef.orderByValue().limitToLast(10).on('value', (snap) => {
  snap.forEach((d) => {
    let val = d.val();
    hiScores.push({ name: val.name, score: val.score });
  });
  hiScores.reverse().forEach(createScore);
});
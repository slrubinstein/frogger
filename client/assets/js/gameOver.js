const sadNoiseSignalingTheEndOfTheGame = new Audio('assets/sounds/game-over.mp3');
const gameHiScore = document.getElementById('hiScore');
const gameOverScreen = document.getElementById('gameOver');
const dbHiScores = document.getElementById('dbHiScores');
const restart = document.getElementById('restart');
const enterHiScore = document.getElementById('enterHiScore');
const cursor = document.getElementById('cursor');
const enterName = document.getElementById('enterName');

const dbRef = firebase.database().ref().child('dbHiScores');

const hiScores = [];
let name = '';

const MAX_SCORES_LENGTH = 5;

gameOver = (score) => {
  trafficNoise.pause();
  gameOverScreen.style.display = 'flex';
  sadNoiseSignalingTheEndOfTheGame.play();

  if (!hiScores.length || hiScores.length < MAX_SCORES_LENGTH ||
      score > hiScores.slice(-1)[0].score) {
    setTimeout(enterNewHiScore, 500);
    return;
  }
  listenForRestart();
}

enterNewHiScore = () => {
  cursor.style.display = 'inline-block';
  enterHiScore.style.display = 'block';
  document.addEventListener('keyup', nameListener);
}


nameListener = (e) => {
  if (e.keyCode === 13) {
    saveHiScore();
  }
  const letter = String.fromCharCode(e.keyCode)
  name += letter;
  enterName.innerHTML = name;

  if (name.length === 3) {
    saveHiScore();
  }
}

saveHiScore = () => {
  enterHiScore.style.display = 'none';
  document.removeEventListener('keyup', nameListener);
  sendHiScoreToDB();
  listenForRestart();
  cursor.style.display = 'none';
}

listenForRestart = () => {
  document.addEventListener('keyup', onKeyUpRestart);
  restart.style.display = 'block';
}

onKeyUpRestart = (e) => {
  if (e.keyCode === 83 /* S */) {
    gameOverScreen.style.display = 'none';
    initMenu();
    score = 0;
    setScore();
    document.removeEventListener('keyup', onKeyUpRestart);
  }
}

sendHiScoreToDB = () => {
  dbRef.push().set({
    name,
    score
  });
  name = '';
  enterName.innerHTML = '';
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

dbRef.orderByChild('score').limitToLast(MAX_SCORES_LENGTH).on('value', (snap) => {
  hiScores.length = 0;
  snap.forEach((d) => {
    let val = d.val();
    hiScores.push({ name: val.name, score: val.score });
  });
  dbHiScores.innerHTML = '';
  hiScores.reverse().forEach(createScore);
  if (hiScores[0]) {
    displayHiScore(hiScores[0].score);
  }
});


displayHiScore = (score) => {
  hiScore = score;
  gameHiScore.innerHTML = score;
};
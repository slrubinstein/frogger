const menuElement = document.getElementById('menu');
const levelContainer = document.getElementById('levels');
const chooseNumberPlayers = document.getElementById('chooseNumberPlayers');
let activeLevel = 0;
const singlePlayer = document.getElementById('singlePlayer');
const twoPlayer = document.getElementById('twoPlayer');

levels = [
  {img: 'level0.svg', name: 'Live', src: './assets/vid/afternoon.mp4'},
  {img: 'cloud.png', name: 'Morning', src: './assets/vid/level3.mp4'},
  {img: 'sun.png', name: 'Afternoon', src: './assets/vid/510pm.mp4'},
  {img: 'moon.png', name: 'Night', src: './assets/vid/night.mp4'},
];


initMenu = () => {
  document.addEventListener('keyup', onKeyUpStart);
  document.getElementById('menu').style.display = 'flex';
  levels.forEach(level => {
    levelContainer.appendChild(createLevelMarkup(level.img, level.name));
  });
  levelContainer.children[activeLevel].classList.add('active');
}

onKeyUpStart = (e) => {
  if (e.keyCode === 83) chooseNumberOfPlayers(); //S
  else if (e.keyCode > 36 && e.keyCode < 41) {
    e.preventDefault();
    switch (e.keyCode) {
      case 38: activeLevel--; break;
      case 40: activeLevel++; break;
      case 37: activeLevel--; break;
      case 39: activeLevel++; break;
    }
    activeLevel = Math.abs(activeLevel%4);
    if (levels[activeLevel].src === 'live' && game.videoManager.videoMode) {
      game.videoManager.switchToLive();
    } else {
      game.videoManager.switchToVideo(levels[activeLevel].src);
    }
    document.querySelector('.active').classList.remove('active');
    levelContainer.children[activeLevel].classList.add('active');
    horn.play();
  }
}

chooseNumberOfPlayers = () => {
  document.removeEventListener('keyup', onKeyUpStart);
  menuElement.style.display = 'none';
  chooseNumberPlayers.style.display = 'flex';
  chooseNumberPlayers.children[1].classList.add('active');
  document.addEventListener('keyup', onKeyUpNumPlayers);
}

onKeyUpNumPlayers = (e) => {
  e.preventDefault();
  if (e.keyCode === 83) {
    const active = chooseNumberPlayers.querySelector('.active');
    const numPlayers = parseInt(active.dataset.number);
    chooseNumberPlayers.children[1].classList.remove('active');
    chooseNumberPlayers.children[2].classList.remove('active');
    setNumberOfPlayers(numPlayers);
    showInstructions(numPlayers);
  }
  switch (e.keyCode) {
    case 38: changeActiveNumPlayers(); break;
    case 40: changeActiveNumPlayers(); break;
    case 37: changeActiveNumPlayers(); break;
    case 39: changeActiveNumPlayers(); break;
  }
}

setNumberOfPlayers = (numPlayers) => {
  if (numPlayers === 1) {
    singlePlayer.style.display = 'block';
    twoPlayer.style.display = 'none';
  } else if (numPlayers === 2) {
    singlePlayer.style.display = 'none';
    twoPlayer.style.display = 'block';
  }
}

changeActiveNumPlayers = () => {
  ribbit.play();
  chooseNumberPlayers.children[1].classList.toggle('active');
  chooseNumberPlayers.children[2].classList.toggle('active');
}

showInstructions = (numPlayers) => {
  document.removeEventListener('keyup', onKeyUpNumPlayers);
  chooseNumberPlayers.style.display = 'none';
  instructions.style.display = 'flex';
  for (var i = 0; i < 3; i++) {
    setTimeout(() => beep.play(), 800*i);
  }
  setTimeout(() => {
    startCar.play();
    instructions.style.display = 'none';
    game.startGame(numPlayers === 2);
  }, 2500)
  levelContainer.innerHTML = '';
}

createLevelMarkup = (img, name) => {
  const level = document.createElement('div');
  level.classList.add('level');
  level.innerHTML = `
    <img class="arrow" src="../assets/img/arrow.png">
    <span>
      <img class="levelImg" src="../assets/img/${img}">
      <div style="text-align: center">${name}</div>
    </span>`;
  return level;
}

initMenu();

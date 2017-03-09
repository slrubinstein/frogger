const menuElement = document.getElementById('menu');
const levelContainer = document.getElementById('levels');
const beep = new Audio('assets/sounds/beep2.mp3');
beep.volume = .5;
let activeLevel = 0;

levels = [
  {img: 'level0.svg', name: 'Live', src: 'live'},
  {img: 'cloud.png', name: 'Morning', src: './assets/vid/5pm.mp4'},
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
  if (e.keyCode === 83) showInstructions(); //S
  else if (e.keyCode > 36 && e.keyCode < 41) {
    e.preventDefault();
    switch (e.keyCode) {
      case 38: activeLevel--; break;
      case 40: activeLevel++; break;
      case 37: activeLevel--; break;
      case 39: activeLevel++; break;
    }
    activeLevel = Math.abs(activeLevel%4);
    if (levels[activeLevel].src === 'live' && videoMode) {
      switchToLive();
    } else {
      switchToVideo(levels[activeLevel].src);
    }
    document.querySelector('.active').classList.remove('active');
    levelContainer.children[activeLevel].classList.add('active');
    horn.play();
  }
}

showInstructions = (e) => {
  document.removeEventListener('keyup', onKeyUpStart);
  menuElement.style.display = 'none';
  instructions.style.display = 'flex';
  for (var i = 0; i < 3; i++) {
    setTimeout(() => beep.play(), 800*i);
  }
  setTimeout(() => {
    startCar.play();
    instructions.style.display = 'none';
    startGame();
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

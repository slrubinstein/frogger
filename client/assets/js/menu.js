// const body = document.getElementByTagNames('body')[0];
const menuElement = document.getElementById('menu');
const levelContainer = document.getElementById('levels');

levels = [
  {img: 'level0.svg', name: 'Live Stream'},
  {img: 'level1.png', name: 'Manhattan', src: 'lvl1.mov'},
  {img: 'level2.png', name: 'Brooklyn', src: 'lvl2.mov'},
  {img: 'level3.png', name: 'Bronx', src: 'lvl3.mov'},
];


initMenu = () => {
  document.addEventListener('keyup', onKeyUpStart);
  levels.forEach(level => {
    levelContainer.appendChild(createLevelMarkup(level.img, level.name));
  });
}

onKeyUpStart = (e) => {
  if (e.keyCode === 83 /* S */) {
    document.removeEventListener('keyup', onKeyUpStart);
    document.getElementById('menu').style.display = 'none';
    startGame();
  }
}

createLevelMarkup = (img, name) => {
  const level = document.createElement('div');
  level.classList.add('level');
  level.innerHTML = `<img class="levelImg" src="../assets/img/${img}"><div>${name}</div>`;
  return level;
}

initMenu();

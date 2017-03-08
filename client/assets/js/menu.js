const menuElement = document.getElementById('menu');
const levelContainer = document.getElementById('levels');
let activeLevel = 0;

levels = [
  {img: 'level0.svg', name: 'Live'},
  {img: 'level1.png', name: 'Manhattan', src: 'lvl1.mov'},
  {img: 'level2.png', name: 'Brooklyn', src: 'lvl2.mov'},
  {img: 'level3.png', name: 'Bronx', src: 'lvl3.mov'},
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
    document.querySelector('.active').classList.remove('active');
    levelContainer.children[activeLevel].classList.add('active');
  }
}

showInstructions = (e) => {
  document.removeEventListener('keyup', onKeyUpStart);
  menuElement.style.display = 'none';
  instructions.style.display = 'block';
  setTimeout(() => {
    instructions.style.display = 'none';
    startGame();
  }, 3000)
  levelContainer.innerHTML = '';
}

createLevelMarkup = (img, name) => {
  const level = document.createElement('div');
  level.classList.add('level');
  level.innerHTML = `
    <img class="arrow" src="../assets/img/arrow.png">
    <span>
      <img class="levelImg" src="../assets/img/${img}">
      <div>${name}</div>
    </span>`;
  return level;
}

initMenu();

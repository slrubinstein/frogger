// const body = document.getElementByTagNames('body')[0];
const menuElement = document.getElementById('menu');
let menuVideo;

initMenu = () => {
  body.classList.add('skrim');
  menuElement.classList.add('visible');
  document.addEventListener('keyup', onKeyUpStart);
  menuVideo = setInterval(drawVideo, 16);
}

onKeyUpStart = (e) => {
  if (e.keyCode === 83) {
    document.removeEventListener('keyup', onKeyUpStart);
    body.classList.remove('skrim');
    menuElement.classList.remove('visible');
    clearInterval(menuVideo);
    startGame();
  }
}

drawVideo = () => {
  ctx.drawImage(video, 0, 0, w, h);
};

initMenu();
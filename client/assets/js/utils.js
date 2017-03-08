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

newFrogPositionX = (position) => {
  if (position >= 0 && position <= w) {
    frogX = position;
  }
}

newFrogPositionY = (position) => {
  if (position >= 0 && position <= h) {
    frogY = position;
  }
}
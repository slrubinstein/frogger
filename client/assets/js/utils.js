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
  return sum > 500;
}

detectFly = () => {
  return (Math.abs(frogX - flyX) < frogWidth && Math.abs(frogY - flyY) < frogHeight);
}

newFrogPositionX = (position) => {
  if (position >= 0 && position <= w) {
    frogX = position;
  }
}

newFrogPositionY = (position) => {
  if (position >= frogHeight && position <= h - frogHeight) {
    frogY = position;
  }
}
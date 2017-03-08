importScripts('pixelmatch.js');

self.addEventListener('message', function({ data }) {
  pixelmatch(data.img1data, data.img2data, data.diff, data.width, data.height, {
    threshold: 0.2
  });

  self.postMessage({
    'diff': data.diff,
    'prevX': data.prevX,
    'prevY': data.prevY
  });

}, false);

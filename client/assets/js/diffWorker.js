importScripts('pixelmatch.js');

self.addEventListener('message', function({ data }) {
  const diff = pixelmatch(data.img1data, data.img2data, data.diff, data.width, data.height, {
    threshold: 0.2
  });

  self.postMessage({
    'diff': data.diff,
    'difficulty': diff/35000
  });

}, false);

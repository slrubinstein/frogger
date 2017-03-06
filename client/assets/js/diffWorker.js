importScripts('resemble.js');
const { image } = require('canvas-webworker');

self.addEventListener('message', function({ data }) {
  if (resemble) {
    console.log(Image);
    diff = resemble(data.img1)
      .compareTo(data.img2)
      .ignoreColors()
      .onComplete(data => {
        // postMessage(data.getImageDataUrl());
      });
  }
}, false);

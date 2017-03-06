const ws = new WebSocket('ws://localhost:8000');
const canvas = document.getElementById('canvas');
const video = document.getElementById('video');
const jsmpeg = new JSMpeg.Player('ws://localhost:8000', {
  canvas
});

// ws.onmessage = function(evt) {
//   video.src = window.URL.createObjectURL(evt.data)
// }
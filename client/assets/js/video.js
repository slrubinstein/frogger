const url = 'ws://104.131.119.113:8082/';

class VideoManager {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;

    this.JSMpegPlayer = new JSMpeg.Player(url, {
      canvas: canvas,
      disableGl: true,
      videoBufferSize: 1200 * 1200
    });

    this.video = null;
    this.videoMode = false;
    this.switchToVideo('./assets/vid/afternoon.mp4');
  }

  restartVideo() {
    if (this.videoMode && this.video) {
      this.video.pause();
      this.video.currentTime = 0;
      this.video.play();
    }
  }

  switchToVideo(src) {
    if (this.video) {
      this.video.remove();
      this.video = null;
    } else {
      this.JSMpegPlayer.stop();
    }

    this.video = document.createElement('video');
    this.video.src = src;
    this.video.style.display = 'none';
    this.video.loop = true;
    document.body.appendChild(this.video);
    this.video.play();

    this.videoMode = true;
    this.videoTick();
  }

  switchToLive() {
    this.videoMode = false;
    this.JSMpegPlayer.play();

    if (this.video) {
      this.video.remove();
      this.video = null;
    }
  }

  videoTick() {
    try {
      this.context.drawImage(this.video, 0, 0, w, h);
    } catch (e) {
      console.warn('video cannot be drawn to canvas', e);
    }

    if (this.videoMode) {
      window.requestAnimationFrame(this.videoTick.bind(this));
    }
  }
}

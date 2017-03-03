const Stream = require('node-rtsp-stream-es6')

const options = {
  name: 'streamName',
  // url: 'rtsp://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov',
  url: 'rtsp://admin:hack9000@172.23.2.0:554/cam/realmonitor?channel=1&subtype=0',
  port: 8000
}

stream = new Stream(options)

stream.start()
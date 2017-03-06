const Stream = require('node-rtsp-stream-es6')

const options = {
  name: 'lilguy',
  url: 'rtsp://admin:hack9000@10.11.10.217/cam/realmonitor?channel=1&subtype=0',
  port: 8000
}

stream = new Stream(options)

stream.start()
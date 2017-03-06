This is straight from the phoboslab guide. The ffmpeg command needs more tweaking.

1. Run `node websocket-relay.js test`

2. Run in another terminal `ffmpeg -rtsp_transport tcp -i 'rtsp://admin:hack9000@10.11.10.217/cam/realmonitor?channel=1&subtype=1' -f mpegts -b:v 500k -r 30 http://localhost:8081/test/`

3. Open video-stream.html

This is straight from the phoboslab guide. The ffmpeg command needs more tweaking.

1. Run `node websocket-relay.js test`

2. Run in another terminal `ffmpeg -rtsp_transport tcp -i 'rtsp://admin:hack9000@10.11.10.217/cam/realmonitor?channel=1&subtype=0' -f mpegts -vcodec mpeg1video -b:v 6000k -r 20 http://localhost:8081/test/`

3. Open video-stream.html


Other useful ffmpeg options:

1. To output to a video file, change the last option to the name of the file. ie.
`ffmpeg -rtsp_transport tcp -i 'rtsp://admin:hack9000@10.10.10.74/cam/realmonitor?channel=1&subtype=0' -vf 'curves=medium_contrast' -f mpegts -vcodec mpeg1video -b:v 6000k -r 20 traffic2.ts`

2. To crop the video, add a crop filter. It takes the signature `crop=out_w:out_h:x:y`. Filters must be separated by commas. ie.
`ffmpeg -rtsp_transport tcp -i 'rtsp://admin:hack9000@10.10.10.74/cam/realmonitor?channel=1&subtype=0' -vf 'curves=medium_contrast, crop=1200:800:370:194' -f mpegts -vcodec mpeg1video -b:v 6000k -r 20 traffic2.ts`
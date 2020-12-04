import { webSocket } from "https://cdn.jsdelivr.net/npm/rxjs-websockets@8.0.1/lib.es5/index.min.js?module";
//rxjs/webSocket
const subject = webSocket("ws://localhost:8000");

subject.subscribe(
    msg => console.log('message received: ' + msg), // Called whenever there is a message from the server.
    err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
    () => console.log('complete') // Called when connection is closed (for whatever reason).
);

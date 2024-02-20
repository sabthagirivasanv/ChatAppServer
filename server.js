const express = require("express")
const app = express()
const ws = require('express-ws')(app);

const webSocketList = [];
const messageLog = ["prasana"];
app.ws('/', (s, req) => {
    webSocketList.push(s);

    s.on('close', () => {
        if(webSocketList.length > 0){
            let idx = webSocketList.indexOf(s);
            webSocketList.splice(idx, 1);
        }

        console.log("removed a websocket from the pool...");
    });

    s.on('message', webSocketOnMessageReceive);

    console.log('new Incoming connection');
    s.send(JSON.stringify(messageLog), ()=>{})
});

function webSocketOnMessageReceive(message) {
    messageLog.push(message);
    console.log("new message", message);
    const responseList = []
    responseList.push(message);
    if (webSocketList.length > 0){
        for (let each of webSocketList) {
            each.send(JSON.stringify(responseList), ()=>{});
        }
    }
}

app.listen(8080, () => console.log('listening on http://localhost:8080/'));
import express from 'express';
import websocket from 'websocket';
import getUniqueId from './config/config.cjs';

const webSocketServer = websocket.server;
const webSocketPort = '8000';
const app = express();
const server = app.listen(webSocketPort);

const wsServer = new webSocketServer({
    httpServer: server
});

const clients = {};

wsServer.on('request',(request) => {
    const userID = getUniqueId();
    console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');

    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));

    connection.on('message', (message)=>{
        if(message.type === 'utf8') {
            console.log('Received Message: ', message.utf8Data);
            // broadcasting message to all connected clients
            for(let key in clients) {
                clients[key].sendUTF(message.utf8Data);
                console.log(`send message to ${clients[key]}`);
            }
        }

    })
})

console.log('listening on port 8000');
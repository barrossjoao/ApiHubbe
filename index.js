const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let activeUser = null;

wss.on('connection', function connection(ws) {

  if (activeUser !== null) {
    ws.send('Occupied');
    return;
  }

  activeUser = ws;

  ws.on('close', function () {
    activeUser = null;

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send('PageAvailable');
      }
    });
  });
});

server.listen(8080, function listening() {
  console.log('Servidor WebSocket está escutando na porta 8080');
});

module.exports = { server };
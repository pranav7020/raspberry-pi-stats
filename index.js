const WebSocket = require("ws");
const path = require('path');
const express = require("express");
const app = express();

const controller = require('./controller');

// ports
const server_port = 3030;
const ws_port = 8765;

// static web page
app.use(express.static(path.join(__dirname, '/public/')));

app.get('/info', async (req, res) => {
    let data = {};
    data.metrics = await controller.metrics();
    data.systemInfo = await controller.systemInfo();
    data.memory = await controller.memory();
    data.diskUsage = await controller.diskUsage();
    data.network = await controller.networks();
    data.process = await controller.process();
    data.ssh = await controller.sshClients();
    res.json(data);
})

// websocket
const wss = new WebSocket.Server({ port: ws_port });

wss.on('connection', function (ws) {
    const id = setInterval(async function () {
        let payload = {};
        payload.metrics = await controller.metrics();
        payload.process = await controller.process();
        payload.memory = await controller.memory();

        ws.send(JSON.stringify(payload));
    }, 1000);

    ws.on('close', function () {
        clearInterval(id);
    });
});

app.listen(server_port, () => {
    console.log(`Server is running on port : ${server_port} \nWebsocket running on port : ${ws_port}`)
});
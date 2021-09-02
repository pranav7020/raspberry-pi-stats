const WebSocket = require("ws");
const controller = require('../controller');

const wss = new WebSocket.Server({ port: 8080 });

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
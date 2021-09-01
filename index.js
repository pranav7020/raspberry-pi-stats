const express = require("express");
const app = express();
const path = require('path');

const controller = require('./controller');
require('./util/websocket');

const port = 3030;

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

app.listen(port, () => console.log(`Server is running on port : ${port}`));

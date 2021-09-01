// let systemInfo = {
//     hostname: 'nebula',
//     model: 'Raspberry Pi 3 Model B Plus Rev 1.3',
//     os: 'Raspbian GNU/Linux 9 (stretch)',
//     kernel: '4.14.98-v7+',
//     processor: 'ARMv7 Processor rev 4 (v7l)',
//     arch: 'armv7l',
//     hardware: 'BCM2835',
// };

// let metrics = {
//     temperature: '54.2',
//     voltage: '1.35',
//     serverTime: {
//         H: '12',
//         M: '45'
//     },
//     uptime: {
//         days: '0',
//         hours: '1',
//         minutes: '17',
//         seconds: '31'
//     }
// };

// let memory = {
//     ram: {
//         total: '949448',
//         used: '374136',
//         free: '446468',
//         shared: '6112',
//         cache: '128844',
//         available: '539412'
//     },
//     swap: {
//         total: '102396',
//         used: '7168',
//         free: '95228'
//     }
// };

// let diskUsage = [
//     {
//         filesystem: '/dev/root',
//         type: 'ext4',
//         size: 14843,
//         used: 5111,
//         available: 9060,
//         use: '37%',
//         mounted: '/'
//     },
//     {
//         filesystem: '/dev/mmcblk0p1',
//         type: 'vfat',
//         size: 43,
//         used: 22,
//         available: 21,
//         use: '51%',
//         mounted: '/boot'
//     }
// ];

// let network = {
//     etho: {
//         mac: 'b8:27:eb:89:36:0f',
//         ip: '-'
//     },
//     wlan0: {
//         mac: 'b8:27:eb:dc:63:5a',
//         ip: '192.168.43.141/24'
//     }
// };

// let ps = `PID CMD                         %MEM %CPU\n1461 /home/pi/.vscode-server/bin 13.1  3.5\n1460 /home/pi/.vscode-server/bin  9.3  0.6\n1423 /home/pi/.vscode-server/bin  9.0  3.5\n1483 /home/pi/.vscode-server/bin  5.4  0.1\n1122 /home/pi/.vscode-server/bin  4.8  0.4\n1430 /home/pi/.vscode-server/bin  3.4  0.0\n487 /usr/lib/xorg/Xorg :0 -seat  3.4  0.0\n1352 /home/pi/.vscode-server/bin  3.4  0.2\n5782 node commands.js             2.8 44.0\n`

// let sshClients = [
//     {
//         ip: '192.168.43.82',
//         port: '55268'
//     },
//     {
//         ip: '192.168.43.82',
//         port: '55268'
//     }
// ];

// const ws_hostname = window.location.hostname;
const ws_hostname = '192.168.43.141';
const ws_port = 8080;

const ws_URL = `ws://${ws_hostname}:${ws_port}`;

// create websocket connection
const socket = new WebSocket(ws_URL);

socket.onopen = (open) => {
    console.log(`WebSocket open : `)
    socket.send(JSON.stringify({ ping: 'hi iam connected' }))
}

socket.onmessage = (msg) => {
    console.log(`WebSocket message : `)
    // socket.send(JSON.stringify({ ping: 'pong' }))
    console.log(JSON.parse(msg.data));
    metrics = JSON.parse(msg.data);
}

socket.onclose = close => {
    console.log(`WebSocket close : `)
}

socket.onerror = error => {
    console.log(`WebSocket error: `)
    console.log(error)
}

(async () => {
    socket.onmessage = (msg) => {
        console.log(`WebSocket message : `)
        console.log(JSON.parse(msg.data));
        let data = JSON.parse(msg.data);
        let metrics = data.metrics;
        let memory = data.memory;
        let ps = data.process;

        metricsUI(metrics);
        memoryStatusUI(memory);
        processUI(ps);
    }

    // ------------------ General system information ------------------
    function systemInfoUI(systemInfo) {
        document.getElementById('hostname').innerText = systemInfo.hostname || '-';
        document.getElementById('model').innerText = systemInfo.model || '-';
        document.getElementById('os').innerText = systemInfo.os || '-';
        document.getElementById('kernel').innerText = systemInfo.kernel || '-';
        document.getElementById('processor').innerText = systemInfo.processor || '-';
        document.getElementById('architecture').innerText = systemInfo.arch || '-';
        document.getElementById('hardware').innerText = systemInfo.hardware || '-';
    }

    // ------------------ System metrics ------------------
    function metricsUI(metrics) {
        // server time
        document.getElementById('server-hour').innerText = metrics.time.H || '00';
        document.getElementById('server-mins').innerText = metrics.time.M || '00';
        // uptime
        document.getElementById('uptime-days').innerText = metrics.uptime.days || '00';
        document.getElementById('uptime-hours').innerText = ('0' + metrics.uptime.hours).slice(-2) || '00';
        document.getElementById('uptime-mins').innerText = ('0' + metrics.uptime.minutes).slice(-2) || '00';
        // temperature
        document.getElementById('temperature').innerText = metrics.temperature || '0';
        document.getElementById('voltage').innerText = metrics.voltage || '0';
    }

    // ------------------ Memory Status ------------------
    function memoryStatusUI(memory) {
        // ram and swap memory total size
        document.getElementById('ram-size').innerText = Math.floor(memory.ram.total / 1024) || '-';
        document.getElementById('ram-used').innerText = Math.floor(memory.ram.used / 1024) || '-';
        document.getElementById('ram-free').innerText = Math.floor(memory.ram.free / 1024) || '-';
        document.getElementById('ram-cache').innerText = Math.floor(memory.ram.cache / 1024) || '-';
        document.getElementById('ram-available').innerText = Math.floor(memory.ram.available / 1024) || '-';
        document.getElementById('swap-size').innerText = Math.floor(memory.swap.total / 1024) || '-';
        document.getElementById('swap-used').innerText = Math.floor(memory.swap.used / 1024) || '-';
        document.getElementById('swap-free').innerText = Math.floor(memory.swap.free / 1024) || '-';
        // RAM memory percentage
        let ramUsedPercentage = ((memory.ram.used / memory.ram.total) * 100).toFixed(1) + '%';
        document.getElementById('ram-used-percentage').innerText = ramUsedPercentage || '';
        document.getElementById('ram-used-bar').style.width = ramUsedPercentage;

        let ramFreePercentage = ((memory.ram.free / memory.ram.total) * 100).toFixed(1) + '%';
        document.getElementById('ram-free-percentage').innerText = ramFreePercentage || '';
        document.getElementById('ram-free-bar').style.width = ramFreePercentage;

        let ramCachePercentage = ((memory.ram.cache / memory.ram.total) * 100).toFixed(1) + '%';
        document.getElementById('ram-cache-percentage').innerText = ramCachePercentage || '';
        document.getElementById('ram-cache-bar').style.width = ramCachePercentage;

        let ramAvailPercentage = ((memory.ram.available / memory.ram.total) * 100).toFixed(1) + '%';
        document.getElementById('ram-available-percentage').innerText = ramAvailPercentage || '';
        document.getElementById('ram-available-bar').style.width = ramAvailPercentage;
        // SWAP memory percentage
        let swapUsedPercentage = ((memory.swap.used / memory.swap.total) * 100).toFixed(1) + '%';
        document.getElementById('swap-used-percentage').innerText = swapUsedPercentage || '';
        document.getElementById('swap-used-bar').style.width = swapUsedPercentage;

        let swapFreePercentage = ((memory.swap.free / memory.swap.total) * 100).toFixed(1) + '%';
        document.getElementById('swap-free-percentage').innerText = swapFreePercentage || '';
        document.getElementById('swap-free-bar').style.width = swapFreePercentage;
    }

    // ------------------ Running process ------------------
    function processUI(ps) {
        document.getElementById('ps').innerText = ps;
    }

    // ------------------ Disk usage ------------------
    function diskUsageUI(diskUsage) {
        diskUsage.forEach(disk => {
            let liEl = document.createElement('li');
            liEl.innerHTML = `
                <div>
                    <img src="icons/icons8-hdd-96.png" alt="Disk Space">
                </div>
                <div class="disk-size-value">
                    <p>${disk.mounted} [${disk.type}]</p>
                    <div class="memory-value">
                        <div class="memory-chart-bar__outer">
                            <div class="memory-chart-bar__inner" style="width: ${disk.use};"></div>
                        </div>
                        <p>${Math.floor((disk.used / disk.size) * 100)}%</p>
                    </div>
                    <p>${disk.used}M / ${disk.size}M</p>
                </div>
            `;
            document.getElementById('disk-lists').appendChild(liEl)
        })
    }

    // ------------------ Network Status ------------------
    function networkStatusUI(network) {
        document.getElementById('eth0-mac').innerText = network.etho.mac || '-';
        document.getElementById('eth0-ip').innerText = network.etho.ip || '-';
        document.getElementById('wlan0-mac').innerText = network.wlan0.mac || '-';
        document.getElementById('wlan0-ip').innerText = network.wlan0.ip || '-';
    }

    // ------------------ SSH clients ------------------
    function sshClientUI(sshClients) {
        if (sshClients.length === 0) {
            let pEl = document.createElement('p');
            pEl.innerText = 'No ssh clients';
            document.getElementById('section-ssh-wrapper').appendChild(pEl);
        } else {
            sshClients.forEach((ssh, index) => {
                let rowEl = document.createElement('tr');
                rowEl.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${ssh.ip}</td>
                    <td>${ssh.port}</td>
                `;

                document.getElementById('ssh-clients').appendChild(rowEl);
            })
        }
    }

    fetch(`${window.location.origin}/info`)
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            metricsUI(data.metrics);
            memoryStatusUI(data.memory);
            processUI(data.process);
            systemInfoUI(data.systemInfo);
            diskUsageUI(data.diskUsage);
            networkStatusUI(data.network);
            sshClientUI(data.ssh)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
})()




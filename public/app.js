(async () => {
    const ws_hostname = window.location.hostname;
    const ws_port = 8080;
    const ws_URL = `ws://${ws_hostname}:${ws_port}`;

    // create websocket connection
    const socket = new WebSocket(ws_URL);

    socket.onopen = (open) => {
        document.getElementById('live-status').classList.add('on');
    }

    socket.onclose = close => {
        document.getElementById('live-status').classList.remove('on');
        document.getElementById('error').innerText = 'Websocket connection closed!';
    }

    socket.onerror = error => {
        document.getElementById('live-status').classList.remove('on');
        document.getElementById('error').innerText = 'Websocket connection failed!';
    }

    socket.onmessage = (msg) => {
        console.log(`WebSocket message : `)
        console.log(JSON.parse(msg.data));
        let data = JSON.parse(msg.data);
        let metrics = data.metrics;
        let memory = data.memory;
        let ps = data.process;

        metrics && metricsUI(metrics);
        memory && memoryStatusUI(memory);
        ps && processUI(ps);
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
            data.metrics && metricsUI(data.metrics);
            data.memory && memoryStatusUI(data.memory);
            data.process && processUI(data.process);
            data.systemInfo && systemInfoUI(data.systemInfo);
            data.network && networkStatusUI(data.network);
            data.diskUsage && data.diskUsage.length > 0 && diskUsageUI(data.diskUsage);
            data.diskUsage && data.diskUsage.length > 0 ? sshClientUI(data.ssh) : sshClientUI([]);
        })
        .catch((error) => {
            document.getElementById('error').innerText = 'Failed to getting server info!';
        });
})()




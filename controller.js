const { run } = require('./util/execute');

exports.metrics = async () => {
    let data = {};

    const run_temp = run(`cat /sys/class/thermal/thermal_zone0/temp 2>/dev/null`);
    const run_volt = run(`vcgencmd measure_volts core | cut -d '=' -f2 2>/dev/null`);
    const run_date = run(`date +%H:%M`);
    const run_uptime = run(`uptime -s`);

    let [temperature, coreVolt, currentTime, startupPeriod] = await Promise.all([run_temp, run_volt, run_date, run_uptime]);

    // CPU temperature
    data.temperature = temperature ? (temperature / 1000).toFixed(1) : '';

    // core voltage
    data.voltage = coreVolt ? (coreVolt.slice(0, -1) * 1).toFixed(2) : '';

    // server time
    data.time = {
        H: currentTime.split(':')[0],
        M: currentTime.split(':')[1],
    }

    // server uptime
    let [startupDate, startupTime] = startupPeriod.replace(/\n/, '').split(' ');

    let timeDiff = new Date() - new Date(`${startupDate}T${startupTime}`);
    data.uptime = {
        days: Math.floor(timeDiff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)),
    }

    return data;
}

exports.systemInfo = async () => {
    const run_host = run(`hostname`);
    const run_model = run(`cat /sys/firmware/devicetree/base/model 2>/dev/null`);
    const run_os = run(`hostnamectl | grep "Operating System" | cut -d ' ' -f5- 2>/dev/null`);
    const run_kernel = run(`uname -r`);
    const run_arch = run(`arch`);
    const run_cpu = run(`cat /proc/cpuinfo | grep "model name" | uniq | cut -d ' ' -f3- 2>/dev/null`);
    const run_hdware = run(`cat /proc/cpuinfo | grep "Hardware" | cut -d ' ' -f2- 2>/dev/null`);

    let [
        hostname,
        piModel,
        os,
        kernel,
        architecture,
        cpu,
        hardware
    ] = await Promise.all([
        run_host,
        run_model,
        run_os,
        run_kernel,
        run_arch,
        run_cpu,
        run_hdware
    ])

    let data = {
        hostname: hostname,
        model: piModel && piModel.split('\u0000')[0],
        os: os,
        kernel: kernel,
        processor: cpu,
        arch: architecture,
        hardware: hardware,
    };

    return data;
}

exports.memory = async () => {
    const run_ram = run(`free | grep Mem`);
    const run_swap = run(`free | grep Swap`);

    let [ramInfo, swapMemInfo] = await Promise.all([run_ram, run_swap]);

    ramInfo = ramInfo.replace(/\s+/g, ' ').split(' ');
    swapMemInfo = swapMemInfo.replace(/\s+/g, ' ').split(' ');

    let memoryData = {
        ram: {
            total: ramInfo[1],
            used: ramInfo[2],
            free: ramInfo[3],
            cache: ramInfo[5],
            available: ramInfo[6],
        },
        swap: {
            total: swapMemInfo[1],
            used: swapMemInfo[2],
            free: swapMemInfo[3],
        }
    }

    return memoryData;
}

exports.diskUsage = async () => {
    let diskStorage = await run(`df -T -l -x tmpfs -x devtmpfs -x rootfs -x squashfs`);
    let diskLists = diskStorage.split('\n');
    let disks = [];

    for (let i = 1; i < diskLists.length; i++) {
        const element = diskLists[i].replace(/\s+/g, ' ').split(' ');

        let data = {
            filesystem: element[0],
            type: element[1],
            size: Math.ceil(element[2] / 1024),
            used: Math.ceil(element[3] / 1024),
            available: Math.ceil(element[4] / 1024),
            use: element[5],
            mounted: element[6]
        }
        disks.push(data);
    }

    return disks;
}

exports.networks = async () => {
    const run_eMac = run(`cat /sys/class/net/eth0/address 2>/dev/null`);
    const run_eIp = run(`ip -4 addr show dev eth0 2>/dev/null | grep inet | awk '{print $2 "," $4}'`);
    const run_wMac = run(`cat /sys/class/net/wlan0/address 2>/dev/null`);
    const run_wIp = run(`ip -4 addr show dev wlan0 2>/dev/null | grep inet | awk '{print $2 "," $4}'`);

    let [eth0Mac, eth0Ip, wlan0Mac, wlan0IP] = await Promise.all([run_eMac, run_eIp, run_wMac, run_wIp]);
    if (!eth0Mac && !eth0Ip && !wlan0Mac && !wlan0IP) return null;

    let data = {
        etho: {
            mac: eth0Mac ? eth0Mac : '-',
            ip: eth0Ip ? eth0Ip.split(',')[0] : '-',
        },
        wlan0: {
            mac: wlan0Mac ? wlan0Mac : '-',
            ip: wlan0IP ? wlan0IP.split(',')[0] : '-',
        }
    }

    return data;
}

exports.process = async () => {
    let processLists = await run(`ps -eo pid,cmd,%mem,%cpu --sort=-%mem | head 2>/dev/null`);
    if (!processLists) return null;

    let processListsArray = processLists.split('\n');
    let process = '';
    for (let i = 0; i < processListsArray.length; i++) {
        process = process + processListsArray[i].trim() + '\n';
    }

    return process;
}

exports.sshClients = async () => {
    let sshclientsCmd = await run(`ss | grep -i ssh 2>/dev/null`);
    if (!sshclientsCmd) return null;

    let sshClientsArray = sshclientsCmd.split('\n');
    let sshClients = [];
    for (let i = 0; i < sshClientsArray.length; i++) {
        let clientAddress = sshClientsArray[i].trim().replace(/\s+/g, ' ').split(' ')[5];
        sshClients.push({
            ip: clientAddress.split(':')[0],
            port: clientAddress.split(':')[1],
        })
    }

    return sshClients;
}
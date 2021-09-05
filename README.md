# Raspberry Pi Stats

Node.js based web application running on Raspberry Pi to get it's stats such as temperature, uptime, memory usage, disk usage, ssh client lists and system informations.

## Features

- Shows Raspberry Pi system informations, network addresses, disk usage, ssh clients.
- Get live core voltage, temperature, memory, uptime, top memory uasge process with their PID using Web Socket connection.
- Works on local network with out internet connections (no external packages in client side).

## Prerequisites

- Raspberry Pi 3+ models with Node.js

## Installation

### STEP 1

Install Nodejs, npm ,git.

```
sudo apt install nodejs npm git
```

### STEP 2

Clone raspberry-pi-stats repository.

```
git clone https://github.com/pranav7020/raspberry-pi-stats.git
```

### STEP 3

Change to directory _raspberry-pi-stats_ and install npm packages.

```
cd raspberry-pi-stats && npm i
```

### STEP 4

- Start the server.
  ```
  npm start
  ```
- To Stop the server.
  ```
  npm run stop
  ```

### STEP 5

Open browser and go to Raspberry Pi IP address with listening port number **3030**.

eg: `http://192.168.10.3:3030`

- To get Raspberry Pi IP address.
  ```
  hostname -I
  ```

## Screenshot

---

![screenshot 1](/screenshot/screenshot-01.png)
![screenshot 2](/screenshot/screenshot-02.png)

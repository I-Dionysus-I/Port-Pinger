const net = require('net');
const readline = require('readline');

function pingHost(ip, port, callback) {
  const socket = new net.Socket();

  socket.setTimeout(2000); // Timeout in milliseconds

  socket.on('connect', () => {
    socket.destroy();
    callback(true);
  });

  socket.on('timeout', () => {
    socket.destroy();
    callback(false);
  });

  socket.on('error', (error) => {
    socket.destroy();
    callback(false, error.message);
  });

  socket.connect(port, ip);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function startPing(ip, port) {
  setInterval(() => {
    pingHost(ip, port, (success, error) => {
      if (success) {
        console.log(`Ping successful for \x1b[32m${ip} \x1b[0m:\x1b[31m${port}\x1b[0m`);
      } else {
        console.log(`Ping failed for \x1b[32m${ip} \x1b[0m:\x1b[31m${port}\x1b[0m`);
        if (error) {
          console.error(error);
        }
      }
    });
  }, 5000); // Ping every 5 seconds
}

rl.question('Enter the IP address: ', (ip) => {
  rl.question('Enter the port number: ', (port) => {
    console.log('Pinging...');
    startPing(ip, parseInt(port));
  });
});

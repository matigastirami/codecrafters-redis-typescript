import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server: net.Server = net.createServer((connection: net.Socket) => {
  // Handle connection
  connection.on('data', (data) => {
    console.log('data', data.toString())
    const response = Buffer.from("+PONG\r\n", 'utf-8');
    connection.write(response);
  });
});

server.listen(6379, "127.0.0.1");

import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server: net.Server = net.createServer((connection: net.Socket) => {
  // Handle connection
  connection.write(Buffer.from("+PONG\r\n", 'utf-8'));
});

server.listen(6379, "127.0.0.1");

import * as net from "net";
import {executeCommand} from './lib/command-executor';
import {argsToObj} from './utils/utils';

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

export type Plugin = {
  type: string,
  config: any
}

export type Configuration = {
  [key: string]: string;
}

export type RedisConfig = {
  // port: number,
  // host: string,
  // plugins: Array<Plugin>,
  configValues?: Configuration,
}

export const redisConfig: RedisConfig = {}

const plugins = [];

const inputConfig = argsToObj(process.argv.slice(2));

redisConfig.configValues = {
  ...inputConfig
}

// Uncomment this block to pass the first stage
const server: net.Server = net.createServer((connection: net.Socket) => {
  // Handle connection
  connection.on('data', (data) => {
    const cmd = data.toString().replace(new RegExp('\\r\\n', 'g'), ',');
    const response = executeCommand(cmd);
    connection.write(response);
  });
});

server.listen(6379, "127.0.0.1");

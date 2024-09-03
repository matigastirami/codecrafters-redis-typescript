import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const isValidRedisCommand = (command: string): boolean => {
  return ['PING', 'ECHO'].includes(command);
}

const REDIS_DATA_TYPES = {
  SIMPLE_STRING: '+',
  ERROR: '-',
  INTEGER: ':',
  BULK_STRING: '$',
  ARRAY: '*',
}

const isValidRedisDataType = (type: string): boolean => {
  return Object.values(REDIS_DATA_TYPES).includes(type[0]);
}

function RESPToHumanReadable(command: string): Array<string> {
  /**
   * First byte of data determines the type
   * example: *2\r\n$4\r\nECHO\r\n$6\r\nbanana\r\
   */
  const chunks = command.split(',');
  for (let i = 0; i < chunks.length; i++) {
    // create a regex to find \r\n separator on command
    // let nextSeparatorPosition = command.indexOf(',', i);
    const chunk = chunks[i];
    const nextChunk = chunks[i + 1];
    if (isValidRedisDataType(chunk)) {
      switch (chunk[0]) {
        case REDIS_DATA_TYPES.ARRAY:
          return chunks.filter((c, idx) => idx > i && !isValidRedisDataType(c))
      }
    }
  }

  return [];
}

function strToRESP(str: string | null): string {
  return str ? `+${str}\r\n` : '$-1\r\n';
}

type RedisStoreItem = {
  value: string;
  expires?: number;
}

type RedisStore = {
  [key: string]: RedisStoreItem;
}

const store: RedisStore = {};

function executeCommand(command: Array<string>): string {
  let result: string | null = '';
  if (command[0] === 'PING') {
    result = 'PONG';
  }
  if (command[0] === 'ECHO') {
    result = command[1];
  }
  if (command[0] === 'SET') {
    const currentTimestamp = new Date()
    const shouldSetExpiration = command[3] === 'px';
    store[command[1]] = {
      value: command[2],
      expires: shouldSetExpiration ? Number(command[4]) + currentTimestamp.getTime() : undefined
    };
    result = 'OK';
  }
  if (command[0] === 'GET') {
    const item = store[command[1]];
    if (!item) {
      result = '-1';
    } else {
      if (item.expires && (new Date()).getTime() > item.expires) {
        result = null;
        delete store[command[1]];
      } else {
        result = item.value;
      }
    }
  }

  return strToRESP(result);
}

// Uncomment this block to pass the first stage
const server: net.Server = net.createServer((connection: net.Socket) => {
  // Handle connection
  connection.on('data', (data) => {
    const cmd = data.toString().replace(new RegExp('\\r\\n', 'g'), ',');
    const parsedData = RESPToHumanReadable(cmd);
    const response = executeCommand(parsedData);
    connection.write(response);
  });
});

server.listen(6379, "127.0.0.1");

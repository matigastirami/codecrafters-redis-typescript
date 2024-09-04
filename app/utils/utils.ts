import {REDIS_DATA_TYPES} from '../types';

export const isValidRedisCommand = (command: string): boolean => {
  return ['PING', 'ECHO'].includes(command);
}

export const isValidRedisDataType = (type: string): boolean => {
  return Object.values(REDIS_DATA_TYPES).includes(type[0]);
}

export function RESPToHumanReadable(command: string): Array<string> {
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

export function strToRESP(str: string | string[] | null): string {
  if (Array.isArray(str)) {
    return `*${str.length}\r\n${str.map((s) => `$${s.length}\r\n${s}`).join('\r\n')}\r\n`;
  }

  return str ? `+${str}\r\n` : '$-1\r\n';
}

export const argsToObj = (args: string[]): Record<string, string> => {
  const obj: Record<string, string> = {};
  for (let i = 0; i < args.length; i += 2) {
    obj[args[i].slice(2)] = args[i + 1];
  }
  return obj;
};
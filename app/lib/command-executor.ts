import {RESPToHumanReadable, strToRESP} from '../utils/utils';
import {store} from '../store/store';
import {redisConfig} from '../main';

export function executeCommand(rawCommand: string): string {
  const command = RESPToHumanReadable(rawCommand);
  let result: string | string[] | null = '';
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
  if (command[0] === 'CONFIG') {
    if (command[1] === 'GET') {
      const configValue = redisConfig.configValues?.[command[2]];
      result = configValue ? [command[2], configValue] : null;
    }
  }

  return strToRESP(result);
}
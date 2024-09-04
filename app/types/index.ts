export type RedisStoreItem = {
  value: string;
  expires?: number;
}

export type RedisStore = {
  [key: string]: RedisStoreItem;
}

export const REDIS_DATA_TYPES = {
  SIMPLE_STRING: '+',
  ERROR: '-',
  INTEGER: ':',
  BULK_STRING: '$',
  ARRAY: '*',
}
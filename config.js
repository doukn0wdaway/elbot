import "dotenv/config";

export const BASE_URL = process.env.BASE_URL;
export const DTEK_URL = process.env.DTEK_URL;
export const BOT_TOKEN = process.env.BOT_TOKEN;
export const PINGER_HOST = process.env.PINGER_HOST;
export const PING_INTERVAL = Number(process.env.PING_INTERVAL);
export const IS_NOT_ALIVE_MAX_INTERVAL = Number(
  process.env.IS_NOT_ALIVE_MAX_INTERVAL,
);

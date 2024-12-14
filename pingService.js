import ping from "ping";
import {
  PINGER_HOST,
  IS_NOT_ALIVE_MAX_INTERVAL,
  PING_INTERVAL,
} from "./config.js";

async function pingHost() {
  let alive = false;
  await ping.sys.probe(PINGER_HOST, (isAlive) => {
    alive = isAlive;
  });
  return alive;
}

export function pingServiceSetup(cb, cbAlt) {
  let failedPingsCount = 0;
  let isCbFired = false;

  async function setupPing() {
    const isMaxAliveIntervalReached =
      failedPingsCount * PING_INTERVAL > IS_NOT_ALIVE_MAX_INTERVAL;

    if (isMaxAliveIntervalReached && !isCbFired) {
      isCbFired = true;
      cb();
      failedPingsCount = 0;
      return;
    }

    const isAlive = await pingHost();
    if (!isAlive) failedPingsCount++;
    else {
      isCbFired = false;
      failedPingsCount = 0;
    }
  }

  setInterval(setupPing, PING_INTERVAL);
}

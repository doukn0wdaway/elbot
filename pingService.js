import ping from "ping";
import { IS_NOT_ALIVE_CHECKS, PINGER_HOST, PING_INTERVAL } from "./config.js";
import { getDTEKMessage } from "./api.js";
import { getCurrentTime } from "./utils/time.js";

async function pingHost() {
  return (
    await ping.promise.probe(PINGER_HOST, {
      deadline: PING_INTERVAL / 1000,
      extra: ["-c", "4"],
    })
  ).alive;
}

export async function pingServiceSetup(onDisconnect, onReconnect) {
  let isOnReconnectFired = false;
  let isOnDisconnectFired = false;
  let pingsQueue = [];
  while (true) {
    const isAlive = await pingHost();
    pingsQueue.push(isAlive);
    console.log(pingsQueue);
    if (pingsQueue.length <= IS_NOT_ALIVE_CHECKS) continue;
    const falsesCount = pingsQueue.reduce(
      (count, value) => (value === false ? count + 1 : count),
      0,
    );
    if (falsesCount >= IS_NOT_ALIVE_CHECKS && !isOnDisconnectFired) {
      onDisconnect();
      isOnReconnectFired = false;
      isOnDisconnectFired = true;
    }

    if (falsesCount <= 0 && !isOnReconnectFired) {
      onReconnect();
      isOnReconnectFired = true;
      isOnDisconnectFired = false;
    }
    pingsQueue.shift();
  }
}

export async function onDisconnect() {
  const dtekMessage = await getDTEKMessage();
  const time = getCurrentTime();

  return `<b>🔴 Аллах сказал света не быть 🔴</b>

<b>Время фактического отключения:</b> ${time}

${dtekMessage}`;
}

export function onReconnect() {
  const time = getCurrentTime();

  return `<b>🟢 Альхамдулиллях света сейчас быть 🟢</b>

<b>Время фактического включения:</b> ${time}`;
}

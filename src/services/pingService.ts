import ping from "ping";
import { IS_NOT_ALIVE_CHECKS, PING_INTERVAL, PINGER_HOST } from "../config";

const pingHost = async () => {
  await new Promise(function (resolve) {
    setTimeout(resolve, PING_INTERVAL - 1000);
  });

  return (
    await ping.promise.probe(PINGER_HOST, {
      deadline: 1,
    })
  ).alive;
};

export const startPingService = async (
  onDisconnect: () => any,
  onReconnect: () => any,
) => {
  let query: boolean[] = [];
  let isDisconnectCallbackLaunched = false;
  let isReconnectCallbackLaunched = false;

  while (true) {
    const isAlive = await pingHost();
    query.push(isAlive);
    if (query.length > IS_NOT_ALIVE_CHECKS) query.shift();
    if (query.length !== IS_NOT_ALIVE_CHECKS) {
      continue;
    }

    const falseCount = query.reduce((count, curVal) => {
      if (curVal === false) count++;
      return count;
    }, 0);

    if (
      falseCount / IS_NOT_ALIVE_CHECKS >= 0.7 &&
      !isDisconnectCallbackLaunched
    ) {
      onDisconnect();
      isDisconnectCallbackLaunched = true;
      isReconnectCallbackLaunched = false;
      continue;
    }

    if (
      falseCount / IS_NOT_ALIVE_CHECKS <= 0.3 &&
      !isReconnectCallbackLaunched
    ) {
      onReconnect();
      isDisconnectCallbackLaunched = false;
      isReconnectCallbackLaunched = true;
      continue;
    }
  }
};

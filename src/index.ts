import { PINGER_HOST } from "./config";
import {
  sendHTMLMessageToAllChats,
  startBotService,
} from "./services/botService";
import { getStatusByDTEK } from "./services/dtekApiService";
import { startPingService } from "./services/pingService";
import { logger } from "./utils/logging";
import { msgBuilder } from "./utils/tgMessagesBuilder";

const onDisconnect = async () => {
  logger.hostIsOffline(PINGER_HOST);

  const dtekStatus = await getStatusByDTEK();
  const message =
    msgBuilder.electricityIsNotHere() +
    "\n" +
    msgBuilder.dtekStatus(dtekStatus);

  sendHTMLMessageToAllChats(message, "yes");
};

const onReconnect = async () => {
  logger.hostIsOnline(PINGER_HOST);

  const dtekStatus = await getStatusByDTEK();
  const message =
    msgBuilder.electricityIsHere() + "\n" + msgBuilder.dtekStatus(dtekStatus);

  sendHTMLMessageToAllChats(message, "yes");
};

startPingService(onDisconnect, onReconnect);

startBotService();

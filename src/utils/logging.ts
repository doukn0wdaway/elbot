import { IBotChatInfo, IChatInfo } from "../services/types";

export enum COLORS {
  reset = "\x1b[0m",
  red = "\x1b[31m",
  green = "\x1b[32m",
  yellow = "\x1b[33m",
  blue = "\x1b[34m",
  magenta = "\x1b[35m",
  cyan = "\x1b[36m",
  black = "\x1b[30m",
  white = "\x1b[37m",
  bgRed = "\x1b[41m", // Красный фон
  bgGreen = "\x1b[42m", // Зелёный фон
}

export const logger = {
  hostIsOffline: (host: string) =>
    console.log(
      `${COLORS.bgRed}${COLORS.black}❌Host ${host} is offline${COLORS.reset}`,
    ),

  hostIsOnline: (host: string) =>
    console.log(
      `${COLORS.bgGreen}${COLORS.black}✅Host ${host} is back to online${COLORS.reset}`,
    ),

  botIsAddedToChat: ({ chatId, name }: IBotChatInfo) =>
    console.log(
      `${COLORS.cyan}Bot is added to chat  ${name} id:${chatId}${COLORS.reset}`,
    ),

  botIsRemovedFromChat: ({ chatId, name }: IBotChatInfo) =>
    console.log(
      `${COLORS.yellow}Bot is removed from chat  ${name} id:${chatId}${COLORS.reset}`,
    ),

  botPingerTurned: (chat: IChatInfo) => {
    const coloredState =
      chat.sendPingerInfo === true
        ? `${COLORS.green}True${COLORS.reset}`
        : `${COLORS.red}False${COLORS.reset}`;

    console.log(
      `Pinger is turned in chat  ${chat.name} id: ${chat.chatId} to state: ${coloredState}`,
    );
  },
};

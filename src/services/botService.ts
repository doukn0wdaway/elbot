import { Context, Telegraf } from "telegraf";
import { BOT_TOKEN } from "../config";
import { getScheduleImage, getStatusByDTEK } from "./dtekApiService";
import {
  addChat,
  getAllChats,
  getChatsWithoutPinger,
  getChatsWithPinger,
  removeChat,
  turnPingerInChat,
} from "./dbService";
import { logger } from "../utils/logging";
import { IBotChatInfo } from "./types";
import { msgBuilder } from "../utils/tgMessagesBuilder";

const bot = new Telegraf(BOT_TOKEN);

const formatChatInfo = (ctx: Context): IBotChatInfo | null => {
  if (!ctx.chat) return null;
  const chatId = String(ctx.chat.id);
  const name =
    ctx.chat.type === "private"
      ? ctx.chat.username || ctx.chat.first_name || "Private Chat"
      : ctx.chat.title;

  return { chatId, name };
};

bot.on("message", async (ctx, next) => {
  const chatInfo = formatChatInfo(ctx);
  if (chatInfo) addChat(chatInfo);

  next();
});

bot.on("new_chat_members", async (ctx) => {
  const isThisBotAdded = ctx.message.new_chat_members.some(
    (member) => member.id === ctx.botInfo.id,
  );
  if (!isThisBotAdded) return;

  const chatInfo = formatChatInfo(ctx);
  if (!chatInfo) return;

  logger.botIsAddedToChat(chatInfo);
  addChat(chatInfo);
});

bot.on("left_chat_member", async (ctx) => {
  if (ctx.message.left_chat_member.id !== ctx.botInfo.id) return;

  const chatInfo = formatChatInfo(ctx);
  if (!chatInfo) return;

  logger.botIsRemovedFromChat(chatInfo);
  removeChat(chatInfo.chatId);
});

bot.command("schedule", async (ctx) => {
  const imageUrl = await getScheduleImage();
  if (imageUrl) await ctx.replyWithPhoto(imageUrl);
  else {
    await ctx.reply("There is no dtek schedule right now");
  }
});

bot.command("status", async (ctx) => {
  const dtekStatus = await getStatusByDTEK();
  await ctx.reply(msgBuilder.dtekStatus(dtekStatus), { parse_mode: "HTML" });
});

bot.command("turn", async (ctx) => {
  if (ctx.message.from.id !== 532389723) return;

  const chatInfo = formatChatInfo(ctx);
  if (!chatInfo) return null;

  const updatedChat = turnPingerInChat(chatInfo);

  const message =
    updatedChat.sendPingerInfo === true
      ? "Pinger is enabled"
      : "Pinger is disabled";

  logger.botPingerTurned(updatedChat);
  ctx.reply(message, { parse_mode: "HTML" });
});

export const startBotService = () => {
  bot.launch({ dropPendingUpdates: true });
};

export const sendHTMLMessage = (chatId: string, text: string) => {
  bot.telegram.sendMessage(chatId, text, { parse_mode: "HTML" });
};

export const sendHTMLMessageToAllChats = (
  text: string,
  pingerUsage?: "no" | "yes",
) => {
  const chats =
    pingerUsage === "yes"
      ? getChatsWithPinger()
      : pingerUsage === "no"
        ? getChatsWithoutPinger()
        : getAllChats();

  chats.forEach((chat) => sendHTMLMessage(chat.chatId, text));
};

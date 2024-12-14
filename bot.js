import { Telegraf } from "telegraf";
import { BOT_TOKEN } from "./config.js";
import { getDTEKMessage, getImageUrl } from "./api.js";
import { loadChatIds, saveChatIds } from "./fs.js";

export const bot = new Telegraf(BOT_TOKEN);

bot.command("status", async (ctx) => {
  const data = await getDTEKMessage();
  if (data) ctx.reply(data, { parse_mode: "HTML" });
});

bot.on("new_chat_members", (msg) => {
  const chatId = msg.chat.id;
  const chatTitle = msg.chat.title || msg.chat.username || "Private Chat";

  let chatIds = loadChatIds();

  if (!chatIds.some((chat) => chat.id === chatId)) {
    chatIds.push({ id: chatId, title: chatTitle });
    saveChatIds(chatIds);
    console.log(`Added to chat: ${chatTitle} (ID: ${chatId})`);
  }
});

bot.command("schedule", async (ctx) => {
  const imageUrl = await getImageUrl();
  await ctx.replyWithPhoto(imageUrl);
});

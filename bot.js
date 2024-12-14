import { Telegraf } from "telegraf";
import { BOT_TOKEN } from "./config.js";
import { getDTEKMessage, getImageUrl } from "./api.js";

export const bot = new Telegraf(BOT_TOKEN);

bot.command("status", async (ctx) => {
  const data = await getDTEKMessage();
  if (data) ctx.reply(data, { parse_mode: "HTML" });
});

bot.command("schedule", async (ctx) => {
  const imageUrl = await getImageUrl();
  await ctx.replyWithPhoto(imageUrl);
});

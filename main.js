import { getDTEKMessage } from "./api.js";
import { bot } from "./bot.js";
import { pingServiceSetup } from "./pingService.js";

const chatId = "532389723";
bot.launch();

pingServiceSetup(async () => {
  const dateInTimeZone = new Date()
    .toLocaleString("en-US", {
      timeZone: "Europe/Kyiv",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace("/", ":");
  const dtekMessage = await getDTEKMessage();
  const message = `<b>🔴 Аллах сказал света не быть 🔴</b>

<b>Время фактического отключения:</b> ${dateInTimeZone}

${dtekMessage}`;
  bot.telegram.sendMessage(chatId, message, { parse_mode: "HTML" });
});

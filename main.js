import { bot } from "./bot.js";
import { CHANNEL_CHAT_ID } from "./config.js";
import { onDisconnect, onReconnect, pingServiceSetup } from "./pingService.js";

pingServiceSetup(
  async () => {
    console.log("onDisconnect");
    bot.telegram.sendMessage(CHANNEL_CHAT_ID, await onDisconnect(), {
      parse_mode: "HTML",
    });
  },
  () => {
    console.log("on reconnect");
    bot.telegram.sendMessage(CHANNEL_CHAT_ID, onReconnect(), {
      parse_mode: "HTML",
    });
  },
);

bot.launch();

import { bot } from "./bot.js";
import { loadChatIds } from "./fs.js";
import { onDisconnect, onReconnect, pingServiceSetup } from "./pingService.js";

pingServiceSetup(
  () => {
    console.log("on disconnect");
    loadChatIds().forEach(async (el) => {
      bot.telegram.sendMessage(el.id, await onDisconnect(), {
        parse_mode: "HTML",
      });
    });
  },
  () => {
    console.log("on reconnect");
    loadChatIds().forEach((el) => {
      bot.telegram.sendMessage(el.id, onReconnect(), {
        parse_mode: "HTML",
      });
    });
  },
);

bot.launch();

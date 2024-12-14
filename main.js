import { bot } from "./bot.js";
import { loadChatIds } from "./fs.js";
import { onDisconnect, onReconnect, pingServiceSetup } from "./pingService.js";

pingServiceSetup(
  async () => {
    console.log("onDisconnect");
    loadChatIds().forEach((el) => {
      bot.telegram.sendMessage(el.id, onDisconnect(), {
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

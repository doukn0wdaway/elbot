import { CHAT_IDS_FILE } from "./config.js";
import * as fs from "fs";
export const loadChatIds = () => {
  try {
    const chatIds = JSON.parse(fs.readFileSync(CHAT_IDS_FILE, "utf8"));
    console.log(chatIds);
    return chatIds;
  } catch (err) {
    return [];
  }
};

// Save chat IDs to file
export const saveChatIds = (chatIds) => {
  fs.writeFileSync(CHAT_IDS_FILE, JSON.stringify(chatIds, null, 2));
};

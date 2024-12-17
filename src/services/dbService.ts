import Database from "better-sqlite3";
import { IBotChatInfo, IChatInfo } from "./types";
const db = new Database("data/database.sqlite");

db.exec(`
  CREATE TABLE IF NOT EXISTS chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    chatId INTEGER UNIQUE NOT NULL,
    sendPingerInfo BOOLEAN NOT NULL DEFAULT FALSE 
  )
`);

export const getAllChats = () => {
  const chats = db.prepare("SELECT * FROM chats;").all() as IChatInfo[];
  return chats;
};

export const getChatsWithPinger = () => {
  const chats = db
    .prepare("SELECT * FROM chats WHERE sendPingerInfo = True;")
    .all() as IChatInfo[];
  return chats;
};

export const getChatsWithoutPinger = () => {
  const chats = db
    .prepare("SELECT * FROM chats WHERE sendPingerInfo = False;")
    .all() as IChatInfo[];
  return chats;
};

export const addChat = ({ chatId, name }: IBotChatInfo) => {
  db.prepare("INSERT OR IGNORE INTO chats (chatId, name) VALUES (?, ?);").run(
    chatId,
    name,
  );
};

export const getChatInfo = ({ chatId }: IBotChatInfo) => {
  const chat = db
    .prepare("SELECT * FROM chats WHERE chatId = ?;")
    .get(chatId) as IChatInfo;
  return chat;
};

export const turnPingerInChat = (chatInfo: IBotChatInfo): IChatInfo => {
  db.prepare(
    `UPDATE chats SET sendPingerInfo = NOT sendPingerInfo WHERE chatId = ?;`,
  ).run(chatInfo.chatId);

  const updatedRecord = getChatInfo(chatInfo);

  return {
    ...updatedRecord,
    sendPingerInfo: Boolean(updatedRecord.sendPingerInfo),
  };
};

export const removeChat = (chatId: string) => {
  db.prepare("DELETE FROM chats WHERE chatId = ?;").run(chatId);
};

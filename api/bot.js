import TelegramBot from "node-telegram-bot-api";

process.env.NTBA_FIX_319 = 1;
const bot = new TelegramBot(process.env.BOT_TOKEN);

export default bot;

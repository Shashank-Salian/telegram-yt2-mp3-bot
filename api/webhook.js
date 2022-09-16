import TelegramBot from "node-telegram-bot-api";
import { isAllowed, sendMessage } from "./helpers.js";
import { onStart, onStop, onOtherMsg, onHelp } from "./onMessages.js";

const main = async (req, res) => {
	/**
	 * @type {TelegramBot.Message}
	 */
	const msg = { ...req.body.message };
	try {
		if (req.body && req.body.message) {
			if (isAllowed(msg.from.id)) {
				switch (msg.text) {
					case "/start":
						await onStart(msg);
						break;
					case "/stop":
						await onStop(msg);
						break;
					case "/help":
						await onHelp(msg);
					default:
						await onOtherMsg(msg);
				}
			} else {
				await sendMessage(msg, "Sorry, this service is limited :(");
			}
		}
	} catch (err) {
		console.log(err);
		await sendMessage(msg, "Something wen't wrong!\nServer error!");
	}
	res.status(200).send("OK");
};

export default main;

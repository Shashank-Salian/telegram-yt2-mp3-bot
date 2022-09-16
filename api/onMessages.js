import TelegramBot from "node-telegram-bot-api";
import { findLinkType, removeUpdates, sendMessage } from "./helpers.js";
import sendIgMedia from "./igDownload.js";
import sendYtAudio from "./ytDownload.js";

/**
 *
 * @param {TelegramBot.Message} msg
 */
const onStart = async (msg) => {
	await sendMessage(msg, "Hello, send me the YouTube link to download.");
	await sendMessage(
		msg,
		`Copy the link of the media to download and paste it here👇.`,
		true
	);
};

/**
 *
 * @param {TelegramBot.Message} msg
 */
const onStop = async (msg) => {
	await removeUpdates();
	await sendMessage(msg, "Updates removed...");
};

/**
 *
 * @param {TelegramBot.Message} msg
 */
const onHelp = async (msg) => {
	await sendMessage(
		msg,
		"Send a link from YouTube or Instagram to download that media."
	);
};

/**
 *
 * @param {TelegramBot.Message} msg
 */
const onOtherMsg = async (msg) => {
	const linkType = findLinkType(msg.text);
	if (linkType === "YT") {
		await sendYtAudio(msg);
		return;
	}
	if (linkType === "IG") {
		await sendIgMedia(msg);
		return;
	}
	await sendMessage(msg, "Send a valid Instagram or YouTube link!");
};

export { onStart, onStop, onOtherMsg, onHelp };

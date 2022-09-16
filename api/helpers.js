import https from "https";
import TelegramBot from "node-telegram-bot-api";
import bot from "./bot.js";

/**
 * @param {number} id
 * @returns {boolean}
 */
const isAllowed = (id) => {
	for (let i = 1; process.env[`ALLOWED${i}`] !== undefined; i++)
		if (parseInt(process.env[`ALLOWED${i}`]) === id) return true;
	return false;
};

/**
 *
 * @param {TelegramBot.Message} msg
 * @param {string} text
 * @param {boolean} withoutReply
 * @returns {Promise}
 */
const sendMessage = async (msg, text, withoutReply = false) => {
	return await bot.sendMessage(msg.chat.id, text, {
		reply_to_message_id: withoutReply ? undefined : msg.message_id,
		parse_mode: "HTML",
	});
};

/**
 *
 * @param {string} text
 */
const sendMe = async (text) => {
	return await bot.sendMessage(process.env.ALLOWED1, text, {
		parse_mode: "HTML",
	});
};

/**
 *
 * @param {TelegramBot.Message} msg
 * @param {string} textToReplace
 */
const editMessage = async (msg, textToReplace) => {
	const editedMessage = await bot.editMessageText(textToReplace, {
		chat_id: msg.chat.id,
		message_id: msg.message_id,
	});
	return editedMessage;
};

/**
 *
 * @param {TelegramBot.Message} msg
 * @param {any} buff
 */
const sendVideoBuffer = async (msg, buff) => {
	try {
		bot.sendChatAction(msg.chat.id, "upload_video");
		const sentMsg = await bot.sendVideo(msg.chat.id, buff);
		return sentMsg;
	} catch (err) {
		sendMessage(msg, "Error while sending the message!");
		return false;
	}
};

/**
 *
 * @param {TelegramBot.Message} msg
 * @param {string} path
 */
const sendVideoFile = async (msg, path) => {
	try {
		bot.sendChatAction(msg.chat.id, "upload_video");
		const sentMsg = await bot.sendVideo(msg.chat.id, path);
		return sentMsg;
	} catch (err) {
		sendMessage(msg, "Error while sending the message!");
		return false;
	}
};

/**
 *
 * @param {TelegramBot.Message} msg
 * @param {string} path
 */
const sendAudioFile = async (msg, path) => {
	try {
		bot.sendChatAction(msg.chat.id, "upload_audio");
		const sentMsg = await bot.sendAudio(msg.chat.id, path);
		return sentMsg;
	} catch (err) {
		sendMessage(msg, "Error while sending the message!");
		return false;
	}
};

/**
 *
 * @param {TelegramBot.Message} msg
 * @param {string} path
 */
const sendPhoto = async (msg, path) => {
	try {
		bot.sendChatAction(msg.chat.id, "upload_photo");
		const sentMsg = await bot.sendPhoto(msg.chat.id, path);
		return sentMsg;
	} catch (err) {
		sendMessage(msg, "Error while sending the message!");
		return false;
	}
};

/**
 *
 * @param {string} link
 * @returns {"YT" | "IG" | undefined}
 */
const findLinkType = (link) => {
	if (
		/(http(s)?:\/\/)?(m\.)?(www\.)?(youtube\.com)\/(watch)(\/)?(\?)(.*)(v=)(.*[^\s])$/.test(
			link
		) ||
		/(http(s)?:\/\/)?(youtu\.be)\/(.*)$/.test(link)
	)
		return "YT";
	else if (
		/(http(s)?:\/\/)?(www\.)?instagram\.com\/(p|reel|tv|stories)\/.*$/.test(
			link
		)
	)
		return "IG";
	return undefined;
};

/**
 *
 * @param {{ hostName: string, path: string }} info
 * @returns {Promise<any>}
 */
const fetch = (info) => {
	return new Promise((resolve, reject) => {
		https
			.get(
				{
					method: "GET",
					hostname: info.hostName,
					port: null,
					path: info.path,
					headers: {
						"x-rapidapi-host": info.hostName,
						"x-rapidapi-key": process.env.API_TOKEN,
						useQueryString: true,
					},
				},
				(res) => {
					let data = "";
					res.on("data", (chunk) => {
						data += chunk.toString();
					});
					res.on("end", () => {
						data = JSON.parse(data);
						resolve(data);
					});
				}
			)
			.on("error", (err) => {
				reject(err);
			});
	});
};

const removeUpdates = async () => {
	await bot.deleteWebhook({ drop_pending_updates: true });
	const updates = await bot.getUpdates();
	await bot
		.getUpdates({ offset: updates[updates.length - 1].update_id + 1 })
		.catch((err) => {
			console.log(err);
		});
	await bot.setWebHook({ url: "https://yt-2-mp3.vercel.app/api/webhook" });
};

export {
	isAllowed,
	sendMessage,
	removeUpdates,
	editMessage,
	findLinkType,
	sendAudioFile,
	sendPhoto,
	sendVideoBuffer,
	sendVideoFile,
	fetch,
	sendMe,
};

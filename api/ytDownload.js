import TelegramBot from "node-telegram-bot-api";
import { editMessage, fetch, sendAudioFile, sendMessage } from "./helpers.js";

/**
 *
 * @param {string} url
 * @returns {Promise<{ msg: string, duration: number, link: string, title: string, status: "ok" | "fail" }>}
 */
const getAudioInfo = async (url) => {
	return await fetch({
		hostName: "youtube-mp36.p.rapidapi.com",
		path: `/dl?id=${getVideoId(url)}`,
	});
};

/**
 *
 * @param {string} url
 * @returns {string}
 */
const getVideoId = (url) => {
	if (url.includes("youtube.com")) return url.split("v=")[1].split("&")[0];

	if (url.includes("youtu.be")) return url.split(".be/")[1].split("?")[0];

	return "dQw4w9WgXcQ";
};

/**
 *
 * @param {TelegramBot.Message} msg
 */
const sendYtAudio = async (msg) => {
	let sentMsg;
	try {
		sentMsg = await sendMessage(msg, "Downloading...");
		const res = await getAudioInfo(msg.text);
		console.log("YT Request complete");
		if (res.status === "ok") {
			console.log("YT Request successful");
			console.log("YT Sending audio file...");
			await sendAudioFile(msg, res.link);
			return;
		}
		await editMessage(sentMsg, "Wrong Link, or API error!");
		console.log("Couldn't send audio...");
		console.log(res);
	} catch (err) {
		console.log("Send YT Audio :");
		console.log(err);
		await editMessage(sentMsg, "Something went wrong..!");
		return;
	}
};

export default sendYtAudio;

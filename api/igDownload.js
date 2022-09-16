import TelegramBot from "node-telegram-bot-api";
import {
	editMessage,
	fetch,
	sendMessage,
	sendPhoto,
	sendVideoFile,
} from "./helpers";

/**
 *
 * @param {string} link
 * @returns {Promise<{ media: string, type: "Image" | "Video", thumbnail: string }[] | { media: string | string[], Thumbnail: string, title: string, Type: "Post-Video" | "Post-Image" | "Carousel" }>}
 */
const getMediaInfo = async (link) => {
	return await fetch({
		hostName: "instagram-story-downloader-media-downloader.p.rapidapi.com",
		path: `/index?url=${link}`,
	});
};

/**
 *
 * @param {string} link
 * @returns {boolean}
 */
const isImage = (link) => {
	return link.includes(".jpg?");
};

/**
 *
 * @param {string[]} medias
 * @param {TelegramBot.Message} msg
 */
const recognizeAndSendCarousel = (medias, msg) => {
	medias.forEach((media) => {
		if (isImage(media)) {
			sendPhoto(msg, media)
				.then(() => {})
				.catch((err) => {
					console.log(err);
				});
			return;
		}
		sendVideoFile(msg, media)
			.then(() => {})
			.catch((err) => {
				console.log(err);
			});
	});
};

/**
 *
 * @param {string} media
 * @param {TelegramBot.Message} msg
 */
const recognizeAndSend = (media, msg) => {
	if (isImage(media)) {
		sendPhoto(msg, media)
			.then(() => {})
			.catch((err) => {
				console.log(err);
			});
		return;
	}
	sendVideoFile(msg, media)
		.then(() => {})
		.catch((err) => {
			console.log(err);
		});
};

/**
 *
 * @param {TelegramBot.Message} msg
 */
const sendIgMedia = async (msg) => {
	let sentMsg;
	try {
		sentMsg = sendMessage(msg, "Downloading...");
		let res = await getMediaInfo(msg.text);
		// Check if it's a story
		if (Array.isArray(res)) {
			if (res[0].type === "Image") {
				await sendPhoto(msg, res[0].media);
				return;
			}
			await sendVideoFile(msg, res[0].media);
			return;
		}
		if (res.Type !== "Carousel") {
			recognizeAndSend(res.media);
			return;
		}
		/**
		 * @type {string[]}
		 */
		const medias = res.media;
		recognizeAndSendCarousel(medias, msg);
	} catch (err) {
		console.log(err);
		await editMessage(sentMsg, "Error while fetching the data!");
	}
};

export default sendIgMedia;

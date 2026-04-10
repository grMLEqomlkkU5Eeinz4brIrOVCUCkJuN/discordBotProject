import { Events } from "discord.js";
import { Event } from "../../types/event.js";
import logger from "../../utils/logger.js";

const ready: Event<Events.ClientReady> = {
	name: Events.ClientReady,
	once: true,
	execute: async (_client, bot) => {
		logger.info(`Logged in as ${bot.user.tag}`);
		const commands = [...(_client.commands.values())];
		await bot.application.commands.set(commands as never);
		logger.info(`Registered ${commands.length} slash command(s).`);
	},
};

export default ready;
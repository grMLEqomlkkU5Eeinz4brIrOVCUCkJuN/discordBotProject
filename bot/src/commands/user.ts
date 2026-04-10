import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../types/command.js";
import { api, ApiError } from "../utils/api.js";
import logger from "../utils/logger.js";

const user: Command = {
	name: "user",
	aliases: [],
	category: "utility",
	utilisation: "/user <id>",
	description: "Fetches a user from the API by ID.",
	options: [
		{
			name: "id",
			description: "The user ID to look up.",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
	execute: async (interaction: ChatInputCommandInteraction) => {
		const id = interaction.options.getString("id", true);

		if (!/^\d+$/.test(id)) {
			await interaction.reply({
				content: "That doesn't look like a valid Discord user ID.",
				ephemeral: true,
			});
			return;
		}

		await interaction.deferReply();

		try {
			const cached = await api.getUserById(id);
			await interaction.editReply(
				`User \`${cached.id}\`: **${cached.username}** (from cache)`,
			);
			return;
		} catch (err) {
			if (!(err instanceof ApiError) || err.status !== 404) {
				logger.error(`/user lookup failed: ${(err as Error).message}`);
				await interaction.editReply("Failed to reach the API.");
				return;
			}
			// fall through: cache miss, resolve from Discord and populate
		}

		try {
			const discordUser = await interaction.client.users.fetch(id);
			const stored = await api.upsertUser(discordUser.id, discordUser.username);
			await interaction.editReply(
				`User \`${stored.id}\`: **${stored.username}** (fetched from Discord and cached)`,
			);
		} catch (err) {
			if (err instanceof ApiError) {
				await interaction.editReply(
					`Failed to cache user: ${err.message} (status ${err.status})`,
				);
				return;
			}
			logger.error(`/user cache miss handling failed: ${(err as Error).message}`);
			await interaction.editReply(
				"Couldn't find that user on Discord. Double-check the ID.",
			);
		}
	},
};

export default user;

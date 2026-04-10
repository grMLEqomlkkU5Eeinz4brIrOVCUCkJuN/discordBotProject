import { Events, Interaction } from "discord.js";
import { Event } from "../../types/event.js";
import logger from "../../utils/logger.js";

const interactionCreate: Event<Events.InteractionCreate> = {
	name: Events.InteractionCreate,
	execute: async (client, interaction: Interaction) => {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands.get(interaction.commandName.toLowerCase());
		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (err) {
			logger.error(`Command "${interaction.commandName}" failed: ${(err as Error).message}`);
			if (interaction.isRepliable() && !interaction.replied) {
				await interaction.reply({ content: "An error occurred while executing this command.", ephemeral: true });
			}
		}
	},
};

export default interactionCreate;

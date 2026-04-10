import { ChatInputCommandInteraction } from "discord.js";
import { Command } from "../types/command.js";

const ping: Command = {
	name: "ping",
	aliases: [],
	category: "utility",
	utilisation: "/ping",
	description: "Replies with Pong and the bot latency.",
	execute: async (interaction: ChatInputCommandInteraction) => {
		await interaction.reply({ content: "Pinging..." });
		const sent = await interaction.fetchReply();
		const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;
		const heartbeat = interaction.client.ws.ping;
		const heartbeatText = heartbeat >= 0 ? `${Math.round(heartbeat)}ms` : "warming up";
		await interaction.editReply(
			`Pong! Roundtrip: \`${roundtrip}ms\` | Heartbeat: \`${heartbeatText}\``,
		);
	},
};

export default ping;

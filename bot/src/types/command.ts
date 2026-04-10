import { ApplicationCommandOptionData } from "discord.js";

export interface Command {
	name: string,
	aliases: string[],
	category: string,
	utilisation: string,
	description: string,
	options?: ApplicationCommandOptionData[],
	execute: (interaction: any) => Promise<void>
}
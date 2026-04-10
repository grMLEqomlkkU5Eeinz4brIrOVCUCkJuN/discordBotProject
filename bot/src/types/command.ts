export interface Command {
	name: string,
	aliases: string[],
	category: string,
	utilisation: string,
	description: string,
	execute: (interaction: any) => Promise<void>
}
import { Client, ClientOptions, Collection } from "discord.js";
import { Command } from "../types/command.js";

export class MipanMachine extends Client {
	public commands: Collection<string, Command>;

	constructor(options: ClientOptions) {
		super(options);

		this.commands = new Collection();
	}
}


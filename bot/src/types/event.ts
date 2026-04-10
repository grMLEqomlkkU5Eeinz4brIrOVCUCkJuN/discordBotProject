import { ClientEvents } from "discord.js";
import { MipanMachine } from "../bot/client.js";

export interface Event<K extends keyof ClientEvents = keyof ClientEvents> {
	name: K;
	once?: boolean;
	execute: (client: MipanMachine, ...args: ClientEvents[K]) => void | Promise<void>;
}
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { MipanMachine } from "../bot/client.js";
import { Command } from "../types/command.js";
import logger from "../utils/logger.js";
import { walk } from "./walk.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMMANDS_DIR = resolve(__dirname, "../commands");

export async function loadCommands(client: MipanMachine): Promise<Command[]> {
	const files = walk(COMMANDS_DIR);
	const commands: Command[] = [];

	for (const file of files) {
		try {
			const mod = await import(pathToFileURL(file).href);
			const command: Command | undefined = mod.default ?? mod.command;

			if (!command?.name || typeof command.execute !== "function") {
				logger.warn(`Skipping invalid command file: ${file}`);
				continue;
			}

			client.commands.set(command.name.toLowerCase(), command);
			commands.push(command);
			logger.info(`Loaded command: ${command.name}`);
		} catch (err) {
			logger.error(`Failed to load command ${file}: ${(err as Error).message}`);
		}
	}

	logger.info(`Loaded ${commands.length} command(s).`);
	return commands;
}
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { MipanMachine } from "../bot/client.js";
import { Event } from "../types/event.js";
import logger from "../utils/logger.js";
import { walk } from "./walk.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const EVENTS_DIR = resolve(__dirname, "../events");

export async function loadEvents(client: MipanMachine): Promise<number> {
	const files = walk(EVENTS_DIR);
	let count = 0;

	for (const file of files) {
		try {
			const mod = await import(pathToFileURL(file).href);
			const event: Event | undefined = mod.default ?? mod.event;

			if (!event?.name || typeof event.execute !== "function") {
				logger.warn(`Skipping invalid event file: ${file}`);
				continue;
			}

			const listener = (...args: unknown[]) =>
				(event.execute as (...a: unknown[]) => unknown)(client, ...args);

			if (event.once) {
				client.once(event.name, listener);
			} else {
				client.on(event.name, listener);
			}

			count++;
			logger.info(`Loaded event: ${event.name}${event.once ? " (once)" : ""}`);
		} catch (err) {
			logger.error(`Failed to load event ${file}: ${(err as Error).message}`);
		}
	}

	logger.info(`Loaded ${count} event(s).`);
	return count;
}
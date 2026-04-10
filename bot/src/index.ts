import { GatewayIntentBits, Partials } from "discord.js";
import { MipanMachine } from "./bot/client.js";
import { loadCommands, loadEvents } from "./loaders/index.js";
import logger from "./utils/logger.js";
import { env } from "./config/env.js";

const MipanClient = new MipanMachine({
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildScheduledEvents,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.AutoModerationConfiguration,
		GatewayIntentBits.AutoModerationExecution,
		GatewayIntentBits.GuildModeration,
	],
	partials: [Partials.Channel],
});

await loadCommands(MipanClient);
await loadEvents(MipanClient);

await MipanClient.login(env.DISCORD_TOKEN);

logger.info(`PID: ${process.pid}`);
process.traceDeprecation = true;

export default MipanClient;
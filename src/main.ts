import { leaderboardInteraction } from '@commands/interactions/leaderboard.interaction';
import { resetLeaderboardInteraction } from '@commands/interactions/reset-leaderboard.interaction';
import { registerCommands } from '@commands/register-commands';
import { credentials } from '@config/credentials';
import { checkDiscordToken } from '@helpers/functions/discord-token.function';
import { connectMongoDB } from '@mongodb/connection';
import { Client, GatewayIntentBits, Partials, REST } from 'discord.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.Channel],
});

const rest = new REST({ version: '10' }).setToken(credentials.discordToken);

checkDiscordToken();

client.login(credentials.discordToken);

client.on('ready', () => {
  console.log('Discord ready to start');
});

connectMongoDB();

registerCommands(rest);

leaderboardInteraction(client);

resetLeaderboardInteraction(client);

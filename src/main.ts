import { leaderboardInteraction } from '@commands/interactions/leaderboard.interaction';
import { registerCommands } from '@commands/register-commands';
import { credentials } from '@config/credentials';
import { callInvitesEvent } from '@events/invites.event';
import { callWelcomeEvent } from '@events/welcome.event';
import { checkDiscordToken } from '@helpers/functions/tokens/discord-token.function';
import { Client, GatewayIntentBits, Partials, REST } from 'discord.js';
import 'reflect-metadata';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [Partials.Channel],
});

const rest = new REST({ version: '10' }).setToken(credentials.discordToken);

checkDiscordToken();

client.login(credentials.discordToken);

client.on('ready', () => {
  console.log('Discord ready to start');
});

callInvitesEvent(client);

callWelcomeEvent(client);

registerCommands(rest);

leaderboardInteraction(client);

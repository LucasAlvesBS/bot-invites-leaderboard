import { credentials } from '@config/credentials';
import { checkDiscordToken } from '@helpers/functions/discord-token.function';
import { connectMongoDB } from '@mongodb/connection';
import { Client, GatewayIntentBits, Partials } from 'discord.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.Channel],
});

checkDiscordToken();

client.login(credentials.discordToken);

client.on('ready', () => {
  console.log('Discord ready to start');
});

connectMongoDB();

import { credentials } from '@config/credentials';
import { checkDiscordToken } from '@helpers/functions/discord-token.function';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import mongoose from 'mongoose';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.Channel],
});

checkDiscordToken();

client.login(credentials.discordToken);

client.on('ready', () => {
  console.log('Discord ready to start');
});

mongoose
  .connect(credentials.databaseUrl)
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch(() => {
    console.log('Ocorreu um erro ao tentar conectar ao MongoDB');
  });

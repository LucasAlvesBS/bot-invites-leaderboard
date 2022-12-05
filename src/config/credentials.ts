import dotenv from 'dotenv';

dotenv.config();

export const credentials = {
  discordToken: process.env.DISCORD_TOKEN || '',
  botId: process.env.BOT_ID || '',
  guildId: process.env.GUILD_ID || '',
  apiURL: process.env.API_URL,
};

import dotenv from 'dotenv';

dotenv.config();

export const credentials = {
  discordToken: process.env.DISCORD_TOKEN || '',
  databaseUrl: process.env.DATABASE_URL || '',
  botId: process.env.BOT_ID || '',
  guildId: process.env.GUILD_ID || '',
  inviteChannel: process.env.INVITE_CHANNEL,
};

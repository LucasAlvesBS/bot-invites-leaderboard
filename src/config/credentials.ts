import dotenv from 'dotenv';

dotenv.config();

export const credentials = {
  discordToken: process.env.DISCORD_TOKEN,
  databaseUrl: process.env.DATABASE_URL || '',
};

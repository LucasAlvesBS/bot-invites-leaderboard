import { credentials } from '@config/credentials';
import { REST, Routes } from 'discord.js';
import { leaderboardBuild } from './builders/leaderboard.build';
import { resetLeaderboardBuild } from './builders/reset-leaderboard.build';

export const registerCommands = async (rest: REST) => {
  const commands = [leaderboardBuild, resetLeaderboardBuild];
  try {
    console.log(`Started refreshing application (/) commands.`);

    await rest.put(
      Routes.applicationGuildCommands(credentials.botId, credentials.guildId),
      { body: commands },
    );

    console.log(`Successfully reloaded application (/) commands.`);
  } catch (error) {
    console.error;
    throw error;
  }
};

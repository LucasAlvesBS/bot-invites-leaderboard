import { ApplicationCommandType } from 'discord.js';

export const resetLeaderboardBuild = {
  name: 'reset-leaderboard',
  description: 'reset all invites to 0',
  type: ApplicationCommandType.ChatInput,
};

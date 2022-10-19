import { ApplicationCommandType } from 'discord.js';

export const leaderboardBuild = {
  name: 'leaderboard',
  description:
    'Exibir a classificação dos membros com mais convites no servidor.',
  type: ApplicationCommandType.ChatInput,
};

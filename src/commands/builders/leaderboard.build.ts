import {
  //ApplicationCommandOptionType,
  ApplicationCommandType,
} from 'discord.js';

export const leaderboardBuild = {
  name: 'leaderboard',
  description:
    'View the ranking of members with the most invites on the server.',
  type: ApplicationCommandType.ChatInput,
  /* options: [
    {
      name: 'type',
      type: ApplicationCommandOptionType.String,
      description: 'Choose leaderboard type',
      required: true,
      choices: [
        {
          name: 'Invites',
          value: 'invites',
        },
      ],
    },
  ], */
};

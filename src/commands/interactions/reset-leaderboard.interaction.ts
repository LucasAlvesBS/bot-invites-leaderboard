import invitationsSchema from '@mongodb/schemas/invitations.schema';
import { Client } from 'discord.js';

export const resetLeaderboardInteraction = (client: Client) => {
  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'reset-leaderboard') {
      await invitationsSchema.updateMany(
        { guildId: interaction.guild?.id },
        { $set: { numberInvitation: 0 } },
      );

      await interaction.reply({
        content: 'A tabela de classificação foi resetada.',
      });
    }
  });
};

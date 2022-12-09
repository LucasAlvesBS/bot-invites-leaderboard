import axios from 'axios';
import { Client, EmbedBuilder } from 'discord.js';
import { credentials } from '@config/credentials';
import { getAxios } from '@helpers/functions/axios/get.axios';
import { putInPluralOrSingular } from '@helpers/functions/interactions/members/put-in-plural-or-singular.interaction';
import { IInvitersPagination } from '@shared/interfaces/inviters/inviters-pagination.interface';
import { checkPosition } from '@helpers/functions/interactions/inviters/check-position.interaction';

export const leaderboardInteraction = (client: Client) => {
  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'leaderboard') {
      await interaction.deferReply({ ephemeral: true });

      axios.defaults.baseURL = credentials.apiURL;

      const response = await getAxios(axios, 'inviters');

      const data: IInvitersPagination = response.data;
      const invitersRank = data.inviters.slice(0, 10);

      if (!invitersRank) {
        await interaction.editReply({
          content: 'there are no inviters registered yet',
        });
      }

      const inviterPosition =
        invitersRank.findIndex(
          inviterData => inviterData.userId === interaction.user.id,
        ) + 1;

      const positions = invitersRank
        .map(
          (data, index) =>
            `${
              index === 0
                ? ':one:'
                : index === 1
                ? ':two:'
                : index === 2
                ? ':three:'
                : index === 3
                ? ':four:'
                : index === 4
                ? ':five:'
                : index === 5
                ? ':six:'
                : index === 6
                ? ':seven:'
                : index === 7
                ? ':eight:'
                : index === 8
                ? ':nine:'
                : ':keycap_ten:'
            } **${client.users.cache.get(data.userId)?.tag}** - \`${
              data.totalInvitations
            } ${putInPluralOrSingular(data.totalInvitations)}\``,
        )
        .join('\n');

      const embed = new EmbedBuilder()
        .setDescription(':rocket: **Leaderboard**\n\n' + `${positions}`)
        .setColor('White')
        .addFields(
          {
            name: 'Your position',
            value: checkPosition(inviterPosition),
            inline: true,
          },
          {
            name: 'Total inviters',
            value: `\`${data.inviters.length}\``,
            inline: true,
          },
        )
        .setFooter({
          text: 'Powered by Havaianas',
          iconURL: interaction.guild?.iconURL() || undefined,
        })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    }
  });
};

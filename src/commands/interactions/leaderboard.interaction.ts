import axios from 'axios';
import https from 'https';
import { Client, EmbedBuilder } from 'discord.js';
import { IInvitersDetails } from '@shared/interfaces/inviters-details.interface';
import { credentials } from '@config/credentials';

export const leaderboardInteraction = (client: Client) => {
  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'leaderboard') {
      await interaction.deferReply({ ephemeral: true });

      axios.defaults.baseURL = credentials.apiURL;

      const response = await axios.get(`/api/inviters?page=1&limit=999999`, {
        httpsAgent: new https.Agent({ keepAlive: true }),
      });

      const data: IInvitersDetails = response.data;
      const invitersRank = data.inviters.slice(0, 10);

      if (!invitersRank) {
        await interaction.editReply({
          content: `Ainda não há nenhum \`inviter\` registrado.`,
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
                ? '1️⃣'
                : index === 1
                ? '2️⃣'
                : index === 2
                ? '3️⃣'
                : index === 3
                ? '4️⃣'
                : index === 4
                ? '5️⃣'
                : index === 5
                ? '6️⃣'
                : index === 6
                ? '7️⃣'
                : index === 7
                ? '8️⃣'
                : index === 8
                ? '9️⃣'
                : '🔟'
            } **${client.users.cache.get(data.userId)?.tag}** - \`${
              data.totalInvitations
            } convite(s)\``,
        )
        .join('\n');

      const embed = new EmbedBuilder()
        .setTitle('Leaderboard')
        .setDescription(`${positions}`)
        .setColor('Green')
        .setFooter({
          text: `Você se encontra na posição ${inviterPosition}`,
          iconURL: interaction.user.displayAvatarURL({}),
        })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    }
  });
};

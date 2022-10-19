import invitationsSchema from '@mongodb/schemas/invitations.schema';
import { Client, EmbedBuilder } from 'discord.js';

export const leaderboardInteraction = (client: Client) => {
  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'leaderboard') {
      //await interaction.deferReply();

      let serverData = await invitationsSchema
        .find({ guildId: interaction.guild?.id })
        .sort([['numberInvitation', 'descending']])
        .exec();

      serverData = serverData.slice(0, 10);

      if (!serverData) {
        await interaction.reply({
          content: 'Ainda não há nenhum dado salvo registrado.',
        });
      }

      const userPosition =
        serverData.findIndex(
          userData => userData.userId === interaction.user.id,
        ) + 1;

      const positions = serverData
        .map(
          (data, index) =>
            `${
              index === 0
                ? '1️⃣'
                : index + 1
                ? '2️⃣'
                : index + 1
                ? '3️⃣'
                : index + 1
                ? '4️⃣'
                : index + 1
                ? '5️⃣'
                : index + 1
                ? '6️⃣'
                : index + 1
                ? '7️⃣'
                : index + 1
                ? '8️⃣'
                : index + 1
                ? '9️⃣'
                : '🔟'
            } **${client.users.cache.get(data.userId)?.tag}** - \`${
              data.numberInvitation
            } convite(s)\``,
        )
        .join('\n');

      const embed = new EmbedBuilder()
        .setTitle('Leaderboard')
        .setDescription(`${positions}`)
        .setColor('Green')
        .setFooter({
          text: `Você se encontra na posição ${userPosition}`,
          iconURL: interaction.user.displayAvatarURL({}),
        })
        .setTimestamp();

      interaction.reply({ embeds: [embed] });
    }
  });
};

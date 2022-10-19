import {
  Client,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import invitationsSchema from 'src/mongodb/schemas/invitations.schema';

export const leaderboard = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription(
      'Exibir a classificação dos membros com mais convites no servidor.',
    ),

  async genreateLeaderboard(client: Client, interaction: CommandInteraction) {
    await interaction.deferReply();

    let serverData = await invitationsSchema
      .find({ guildId: interaction.guild?.id })
      .sort([['numberInvitation', 'descending']])
      .exec();

    serverData = serverData.slice(0, 10);

    if (!serverData) {
      return interaction.reply({
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
          }. **${client.users.cache.get(data.userId)?.username}** - \`${
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

    interaction.followUp({ embeds: [embed] });
  },
};

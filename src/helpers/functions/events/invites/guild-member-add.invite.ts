import { credentials } from '@config/credentials';
import { getAxios } from '@helpers/functions/axios/get.axios';
import { patchAxios } from '@helpers/functions/axios/patch.axios';
import { postAxios } from '@helpers/functions/axios/post.axios';
import { checkInviterOnEntry } from '@helpers/functions/interactions/inviters/check-inviter-entry.interaction';
import { putInPluralOrSingular } from '@helpers/functions/interactions/members/put-in-plural-or-singular.interaction';
import { IInviter } from '@shared/interfaces/inviters/inviter.interface';
import { IInvitersPagination } from '@shared/interfaces/inviters/inviters-pagination.interface';
import axios from 'axios';
import { Client, Collection, Invite, TextChannel } from 'discord.js';

export const startGuildMemberAddInvite = (
  client: Client,
  invites: Collection<unknown, unknown>,
) => {
  client.on('guildMemberAdd', async member => {
    if (member.user.bot) {
      return;
    }

    console.log(invites);
    const newInvites = await member.guild.invites.fetch();
    const oldInvites = invites.get(member.guild.id) as Collection<
      string,
      Invite
    >;

    const invite = newInvites.find(
      i => (i.uses || 0) > (oldInvites.get(i.code) || 0),
    );

    const a = invites.set(
      member.guild.id,
      new Collection(newInvites.map(invite => [invite.code, invite.uses])),
    );
    console.log(a);

    const inviter = await client.users.fetch(invite?.inviter?.id || '');

    if (
      !inviter ||
      inviter.id === member.id ||
      member.guild.members.cache
        .get(inviter.id)
        ?.roles.cache.some(role => role.id === '1035521988376154264')
    ) {
      return;
    }

    const logChannel = member.guild.channels.cache.find(
      channel => channel.id === '1031649243594768485',
    ) as TextChannel;

    const accountCreationDate = new Date(inviter.createdTimestamp);
    const currentDate = new Date();
    const differenceTime = Math.abs(
      currentDate.getTime() - accountCreationDate.getTime(),
    );
    const days = Math.ceil(differenceTime / (1000 * 60 * 60 * 24));

    axios.defaults.baseURL = credentials.apiURL;

    const response = await getAxios(axios, 'inviters');

    const data: IInvitersPagination = response.data;

    const inviterOnEntry = checkInviterOnEntry(data, inviter);

    const inviterId = inviterOnEntry?.inviterId;
    const inviterUserId = inviterOnEntry?.inviterUserId;
    const totalInvitations = inviterOnEntry?.totalInvitations as number;

    if (!inviterUserId) {
      const invitersBody = {
        guildId: member.guild.id,
        userId: inviter.id,
        totalInvitations: 1,
        daysCounter: days,
        invalidAccount: false,
      };

      const inviterResponse = await postAxios(axios, 'inviters', invitersBody);

      const data: IInviter = inviterResponse.data;

      console.log(inviterResponse.data);

      const membersBody = {
        guildId: member.guild.id,
        userId: member.id,
        inviter: data.id,
      };

      await postAxios(axios, 'members', membersBody);

      logChannel.send(
        `Welcome, ${member}! You were invited by ${inviter}, who now has ${
          data.totalInvitations
        } ${putInPluralOrSingular(data.totalInvitations)}.`,
      );
    } else {
      const invitersBody = {
        totalInvitations: totalInvitations + 1,
      };

      const patchResponse = await patchAxios(
        axios,
        'inviters',
        inviterId,
        invitersBody,
      );

      const data: IInviter = patchResponse.data;

      const membersBody = {
        guildId: member.guild.id,
        userId: member.id,
        inviter: inviterId,
      };

      await postAxios(axios, 'members', membersBody);

      logChannel.send(
        `Welcome, ${member}! You were invited by ${inviter}, who now has ${
          data.totalInvitations
        } ${putInPluralOrSingular(data.totalInvitations)}.`,
      );
    }
  });
};

import { Client, Collection, Invite, TextChannel } from 'discord.js';
import { promisify } from 'util';
import axios from 'axios';
import { credentials } from '@config/credentials';
import { IInvitersDetails } from '@shared/interfaces/inviters-details.interface';
import { IMembersDetails } from '@shared/interfaces/members-details.interface';
import { getAxios } from '@helpers/functions/axios/get.axios';
import { checkInviterOnEntry } from '@helpers/functions/interactions/inviters/check-inviter-entry.interaction';
import { postAxios } from '@helpers/functions/axios/post.axios';
import { patchAxios } from '@helpers/functions/axios/patch.axios';
import { checkMemberOnExit } from '@helpers/functions/interactions/members/check-member-exit.interaction';
import { deleteAxios } from '@helpers/functions/axios/delete.axios';
import { getMemberAsInviter } from '@helpers/functions/interactions/inviters/get-member-as-inviter.interaction';
import { IInviter } from '@shared/interfaces/inviter.interface';

export const inviteTracker = async (client: Client) => {
  const invites = new Collection();

  const wait = promisify(setTimeout);

  client.on('ready', async () => {
    await wait(5000);

    client.guilds.cache.forEach(async guild => {
      const firstInvites = await guild.invites.fetch();

      invites.set(
        guild.id,
        new Collection(firstInvites.map(invite => [invite.code, invite.uses])),
      );
    });
  });

  client.on('inviteDelete', invite => {
    const getInvites = invites.get(invite.guild?.id) as Collection<
      unknown,
      unknown
    >;
    getInvites.delete(invite.code);
  });

  client.on('inviteCreate', invite => {
    const getInvites = invites.get(invite.guild?.id) as Collection<
      unknown,
      unknown
    >;
    getInvites.set(invite.code, invite.uses);
  });

  client.on('guildCreate', guild => {
    guild.invites.fetch().then(guildInvites => {
      invites.set(
        guild.id,
        new Map(guildInvites.map(invite => [invite.code, invite.uses])),
      );
    });
  });

  client.on('guildDelete', guild => {
    invites.delete(guild.id);
  });

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

    if (!inviter) {
      return;
    }

    // TESTAR ADICIONAR UM BOT
    /* if (member.roles.cache.some(role => role.id === '1035521988376154264')) {
      return;
    } */

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

    const data: IInvitersDetails = response.data;

    const inviterOnEntry = checkInviterOnEntry(data, inviter);

    const inviterId = inviterOnEntry?.inviterId;
    const inviterUserId = inviterOnEntry?.inviterUserId;
    const totalInvitations = inviterOnEntry?.totalInvitations as number;

    let invitersBody: Record<string, unknown>;
    let membersBody: Record<string, unknown>;

    if (!inviterUserId) {
      invitersBody = {
        guildId: member.guild.id,
        userId: inviter.id,
        totalInvitations: 1,
        daysCounter: days,
        invalidAccount: false,
      };

      const inviterResponse = await postAxios(axios, 'inviters', invitersBody);

      const data: IInviter = inviterResponse.data;

      membersBody = {
        guildId: member.guild.id,
        userId: member.id,
        inviter: data.id,
      };

      await postAxios(axios, 'members', membersBody);

      logChannel.send(
        `${member} joined using invite code ${
          invite?.code || ''
        } from ${inviter} and now has ${data.totalInvitations} invites.`,
      );
    } else {
      invitersBody = {
        totalInvitations: totalInvitations + 1,
      };

      const patchResponse = await patchAxios(
        axios,
        'inviters',
        inviterId,
        invitersBody,
      );

      const data: IInviter = patchResponse.data;

      console.log(patchResponse.data);

      membersBody = {
        guildId: member.guild.id,
        userId: member.id,
        inviter: inviterId,
      };

      await postAxios(axios, 'members', membersBody);

      logChannel.send(
        `${member} joined using invite code ${
          invite?.code || ''
        } from ${inviter} and now has ${data.totalInvitations} invites.`,
      );
    }
  });

  client.on('guildMemberRemove', async member => {
    axios.defaults.baseURL = credentials.apiURL;

    const membersResponse = await getAxios(axios, 'members');

    const memberData: IMembersDetails = membersResponse.data;

    const memberOnExit = checkMemberOnExit(memberData, member);

    const memberId = memberOnExit?.memberId;
    const userId = memberOnExit?.userId;
    const inviterId = memberOnExit?.inviterId;
    const totalInvitations = memberOnExit?.totalInvitations as number;

    if (!userId) return;

    const body = {
      totalInvitations: totalInvitations - 1,
    };

    await patchAxios(axios, 'inviters', inviterId, body);

    await deleteAxios(axios, 'members', memberId);

    const invitersResponse = await getAxios(axios, 'inviters');

    const inviterData: IInvitersDetails = invitersResponse.data;

    const memberIdAsInviter = getMemberAsInviter(inviterData, userId);

    if (memberIdAsInviter) {
      await deleteAxios(axios, 'inviters', memberIdAsInviter);
    }

    const logChannel = member.guild.channels.cache.find(
      channel => channel.id === '1031649243594768485',
    ) as TextChannel;

    logChannel.send(`${member} left.`);
  });
};

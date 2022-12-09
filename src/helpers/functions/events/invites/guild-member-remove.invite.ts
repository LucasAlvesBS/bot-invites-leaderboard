import { credentials } from '@config/credentials';
import { deleteAxios } from '@helpers/functions/axios/delete.axios';
import { getAxios } from '@helpers/functions/axios/get.axios';
import { patchAxios } from '@helpers/functions/axios/patch.axios';
import { checkIfIsInviter } from '@helpers/functions/interactions/inviters/check-if-is-inviter.interaction';
import { checkMemberOnExit } from '@helpers/functions/interactions/members/check-member-exit.interaction';
import { IInvitersPagination } from '@shared/interfaces/inviters/inviters-pagination.interface';
import { IMembersPagination } from '@shared/interfaces/members/members-pagination.interface';
import axios from 'axios';
import { Client } from 'discord.js';

export const startGuildMemberRemoveInvite = (client: Client) => {
  client.on('guildMemberRemove', async member => {
    axios.defaults.baseURL = credentials.apiURL;

    const membersResponse = await getAxios(axios, 'members');

    const memberData: IMembersPagination = membersResponse.data;

    const memberOnExit = checkMemberOnExit(memberData, member);

    const memberId = memberOnExit?.memberId;
    const inviterId = memberOnExit?.inviterId;
    const totalInvitations = memberOnExit?.totalInvitations as number;

    if (memberId) {
      const body = {
        totalInvitations: totalInvitations - 1,
      };

      await patchAxios(axios, 'inviters', inviterId, body);

      await deleteAxios(axios, 'members', memberId);
    }

    const invitersResponse = await getAxios(axios, 'inviters');

    const inviterData: IInvitersPagination = invitersResponse.data;

    const inviterIdThatExists = checkIfIsInviter(inviterData, member.id);

    if (inviterIdThatExists) {
      await deleteAxios(axios, 'inviters', inviterIdThatExists);
    }
  });
};

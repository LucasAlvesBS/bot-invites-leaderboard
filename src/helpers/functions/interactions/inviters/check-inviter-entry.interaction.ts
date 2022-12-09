import { IInvitersPagination } from '@shared/interfaces/inviters/inviters-pagination.interface';
import { User } from 'discord.js';

export const checkInviterOnEntry = (
  data: IInvitersPagination,
  inviter: User,
) => {
  for (let i = 0; i < data.inviters.length; i++) {
    if (data.inviters[i].userId === inviter.id) {
      const inviterId = data.inviters[i].id;
      const inviterUserId = data.inviters[i].userId;
      const totalInvitations = data.inviters[i].totalInvitations;
      return { inviterId, inviterUserId, totalInvitations };
    }
  }
};

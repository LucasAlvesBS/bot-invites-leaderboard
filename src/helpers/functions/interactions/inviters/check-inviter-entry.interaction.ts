import { IInvitersDetails } from '@shared/interfaces/inviters-details.interface';
import { User } from 'discord.js';

export const checkInviterOnEntry = (data: IInvitersDetails, inviter: User) => {
  for (let i = 0; i < data.inviters.length; i++) {
    if (data.inviters[i].userId === inviter.id) {
      const inviterId = data.inviters[i].id;
      const inviterUserId = data.inviters[i].userId;
      const totalInvitations = data.inviters[i].totalInvitations;
      return { inviterId, inviterUserId, totalInvitations };
    }
  }
};

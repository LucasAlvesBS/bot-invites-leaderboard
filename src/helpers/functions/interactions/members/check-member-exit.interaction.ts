import { IMembersDetails } from '@shared/interfaces/members-details.interface';
import { GuildMember, PartialGuildMember } from 'discord.js';

export const checkMemberOnExit = (
  data: IMembersDetails,
  member: GuildMember | PartialGuildMember,
) => {
  for (let i = 0; i < data.members.length; i++) {
    if (data.members[i].userId === member.id) {
      const memberId = data.members[i].id;
      const userId = data.members[i].userId;
      const inviterId = data.members[i].inviter.id;
      const totalInvitations = data.members[i].inviter.totalInvitations;
      return { memberId, userId, inviterId, totalInvitations };
    }
  }
};

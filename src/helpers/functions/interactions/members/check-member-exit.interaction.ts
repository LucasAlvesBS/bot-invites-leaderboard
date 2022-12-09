import { IMembersPagination } from '@shared/interfaces/members/members-pagination.interface';
import { GuildMember, PartialGuildMember } from 'discord.js';

export const checkMemberOnExit = (
  data: IMembersPagination,
  member: GuildMember | PartialGuildMember,
) => {
  for (let i = 0; i < data.members.length; i++) {
    if (data.members[i].userId === member.id) {
      const memberId = data.members[i].id;
      const inviterId = data.members[i].inviter.id;
      const totalInvitations = data.members[i].inviter.totalInvitations;
      return { memberId, inviterId, totalInvitations };
    }
  }
};

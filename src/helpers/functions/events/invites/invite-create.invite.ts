import { Client, Collection } from 'discord.js';

export const startInviteCreate = (
  client: Client,
  invites: Collection<unknown, unknown>,
) => {
  client.on('inviteCreate', invite => {
    const getInvites = invites.get(invite.guild?.id) as Collection<
      unknown,
      unknown
    >;
    getInvites.set(invite.code, invite.uses);
  });
};

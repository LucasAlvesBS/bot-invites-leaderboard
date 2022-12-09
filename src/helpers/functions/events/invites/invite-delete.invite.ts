import { Client, Collection } from 'discord.js';

export const startInviteDelete = (
  client: Client,
  invites: Collection<unknown, unknown>,
) => {
  client.on('inviteDelete', invite => {
    const getInvites = invites.get(invite.guild?.id) as Collection<
      unknown,
      unknown
    >;
    getInvites.delete(invite.code);
  });
};

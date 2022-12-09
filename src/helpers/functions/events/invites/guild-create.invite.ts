import { Client, Collection } from 'discord.js';

export const startGuildCreateInvite = (
  client: Client,
  invites: Collection<unknown, unknown>,
) => {
  client.on('guildCreate', guild => {
    guild.invites.fetch().then(guildInvites => {
      invites.set(
        guild.id,
        new Map(guildInvites.map(invite => [invite.code, invite.uses])),
      );
    });
  });

  return invites;
};

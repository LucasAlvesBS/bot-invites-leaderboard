import { Client, Collection } from 'discord.js';

export const startGuildDelete = (
  client: Client,
  invites: Collection<unknown, unknown>,
) => {
  client.on('guildDelete', guild => {
    invites.delete(guild.id);
  });
};

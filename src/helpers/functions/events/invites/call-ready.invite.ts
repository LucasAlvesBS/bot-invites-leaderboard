import { Client, Collection } from 'discord.js';
import { promisify } from 'util';

export const callReady = (
  client: Client,
  invites: Collection<unknown, unknown>,
) => {
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
};

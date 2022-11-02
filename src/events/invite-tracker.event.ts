import { Client, Collection, Invite, TextChannel } from 'discord.js';
import { promisify } from 'util';

export const inviteTracker = async (client: Client) => {
  const invites = new Collection();

  const wait = promisify(setTimeout);

  client.on('ready', async () => {
    await wait(2000);

    client.guilds.cache.forEach(async guild => {
      const firstInvites = await guild.invites.fetch();

      invites.set(
        guild.id,
        new Collection(firstInvites.map(invite => [invite.code, invite.uses])),
      );
    });
  });

  client.on('inviteDelete', invite => {
    const getInvites = invites.get(invite.guild?.id) as Collection<
      unknown,
      unknown
    >;
    getInvites.delete(invite.code);
  });

  client.on('inviteCreate', invite => {
    const getInvites = invites.get(invite.guild?.id) as Collection<
      unknown,
      unknown
    >;
    getInvites.set(invite.code, invite.uses);
  });

  client.on('guildCreate', guild => {
    guild.invites.fetch().then(guildInvites => {
      invites.set(
        guild.id,
        new Map(guildInvites.map(invite => [invite.code, invite.uses])),
      );
    });
  });

  client.on('guildDelete', guild => {
    invites.delete(guild.id);
  });

  client.on('guildMemberAdd', async member => {
    const newInvites = await member.guild.invites.fetch();

    const oldInvites = invites.get(member.guild.id) as Collection<
      string,
      Invite
    >;

    const invite = newInvites.find(
      i => (i.uses || 0) > (oldInvites.get(i.code) || 0),
    );

    const inviter = await client.users.fetch(invite?.inviter?.id || '');

    const logChannel = member.guild.channels.cache.find(
      channel => channel.id === '1031649243594768485',
    ) as TextChannel;

    inviter
      ? logChannel.send(
          `${member} joined using invite code ${
            invite?.code || ''
          } from ${inviter}. Invite was used ${
            invite?.uses
          } times since its creation.`,
        )
      : logChannel.send(
          `${member.user.tag} joined but I couldn't find through which invite.`,
        );
  });
};

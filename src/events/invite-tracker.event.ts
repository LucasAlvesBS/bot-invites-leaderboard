import { credentials } from '@config/credentials';
import { Inviter } from '@shared/typeorm/entities/inviter.entity';
import { Member } from '@shared/typeorm/entities/members.entity';
import { Client, Collection, Invite, TextChannel } from 'discord.js';
import { createQueryBuilder, getRepository } from 'typeorm';
import { promisify } from 'util';

export const inviteTracker = async (client: Client) => {
  const invites = new Collection();

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
    console.log(invites);
    const newInvites = await member.guild.invites.fetch();
    const oldInvites = invites.get(member.guild.id) as Collection<
      string,
      Invite
    >;

    const invite = newInvites.find(
      i => (i.uses || 0) > (oldInvites.get(i.code) || 0),
    );

    const a = invites.set(
      member.guild.id,
      new Collection(newInvites.map(invite => [invite.code, invite.uses])),
    );
    console.log(a);

    const inviter = await client.users.fetch(invite?.inviter?.id || '');
    console.log(inviter.username);

    if (!inviter) {
      return;
    }

    const logChannel = member.guild.channels.cache.find(
      channel => channel.id === credentials.inviteChannel,
    ) as TextChannel;

    const inviterRepository = getRepository(Inviter);
    const memberRepository = getRepository(Member);

    const user = await inviterRepository.findOne({
      userId: inviter.id,
    });

    let invitesTotal: number | undefined;

    if (!user) {
      const inviteRegister = inviterRepository.create({
        guildId: member.guild.id,
        userId: inviter.id,
        totalInvitations: 1,
        occasionalInvitations: 1,
        daysCounter: 1,
        invalidAccount: false,
      });
      await inviterRepository.save(inviteRegister);
      invitesTotal = inviteRegister.totalInvitations;

      const memberRegister = memberRepository.create({
        guildId: member.guild.id,
        userId: member.id,
        inviter: inviteRegister,
      });

      await memberRepository.save(memberRegister);
    } else {
      inviterRepository.merge(user, {
        totalInvitations: user.totalInvitations + 1,
        occasionalInvitations: user.occasionalInvitations + 1,
      });
      await inviterRepository.save(user);

      const userUpdated = await inviterRepository.findOne({
        userId: inviter.id,
      });

      invitesTotal = userUpdated?.totalInvitations;
    }

    logChannel.send(
      `${member} joined using invite code ${
        invite?.code || ''
      } from ${inviter} and now has ${invitesTotal} invites.`,
    );
  });

  client.on('guildMemberRemove', async member => {
    let invitesTotal: number | undefined;

    const memberWhoLeft = await createQueryBuilder(Member, 'members')
      .leftJoinAndSelect('members.inviter', 'inviter')
      .select([
        'inviter.user_id',
        'inviter.total_invitations',
        'inviter.occasional_invitations',
      ])
      .where('user_id = :user_id', { userId: member.id })
      .getOne();

    if (memberWhoLeft?.inviter === null) {
      return;
    }

    const inviterRepository = getRepository(Inviter);

    if (memberWhoLeft) {
      await inviterRepository.update(
        { userId: memberWhoLeft?.inviter.userId },
        {
          totalInvitations: memberWhoLeft.inviter.totalInvitations - 1,
        },
      );

      const userUpdated = await inviterRepository.findOne({
        userId: memberWhoLeft?.inviter.userId,
      });

      invitesTotal = userUpdated?.totalInvitations;
    }

    const checkMemberLikeInviter = await inviterRepository.findOne({
      userId: member.id,
    });

    if (checkMemberLikeInviter) {
      await inviterRepository.delete({
        userId: member.id,
      });
    }

    const logChannel = member.guild.channels.cache.find(
      channel => channel.id === credentials.inviteChannel,
    ) as TextChannel;

    logChannel.send(
      `${member} left and now ${memberWhoLeft?.inviter.userId} has ${invitesTotal} invites.`,
    );
  });
};

import { Client, Collection } from 'discord.js';
import { startReadyInvite } from '@helpers/functions/events/invites/ready.invite';
import { startInviteDelete } from '@helpers/functions/events/invites/invite-delete.invite';
import { startInviteCreate } from '@helpers/functions/events/invites/invite-create.invite';
import { startGuildCreateInvite } from '@helpers/functions/events/invites/guild-create.invite';
import { startGuildDelete } from '@helpers/functions/events/invites/guild-delete.invite';
import { startGuildMemberAddInvite } from '@helpers/functions/events/invites/guild-member-add.invite';
import { startGuildMemberRemoveInvite } from '@helpers/functions/events/invites/guild-member-remove.invite';

export const callInvitesEvent = async (client: Client) => {
  let invites = new Collection();

  invites = startReadyInvite(client, invites);

  startInviteDelete(client, invites);

  startInviteCreate(client, invites);

  invites = startGuildCreateInvite(client, invites);

  startGuildDelete(client, invites);

  startGuildMemberAddInvite(client, invites);

  startGuildMemberRemoveInvite(client);
};

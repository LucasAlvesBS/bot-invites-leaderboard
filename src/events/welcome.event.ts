import { startGuildMemberAddWelcome } from '@helpers/functions/events/welcome/guild-member-add.welcome';
import { Client } from 'discord.js';

export const callWelcomeEvent = (client: Client) => {
  startGuildMemberAddWelcome(client);
};

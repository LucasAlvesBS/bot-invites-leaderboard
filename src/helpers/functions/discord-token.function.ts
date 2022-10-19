import { credentials } from '@config/credentials';
import { errorMessage } from '@helpers/messages/error.message';

export const checkDiscordToken = () => {
  if (!credentials.discordToken) {
    throw new Error(errorMessage.INVALID_TOKEN);
  }
};

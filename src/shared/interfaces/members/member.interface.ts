import { IInviter } from '../inviters/inviter.interface';

export interface IMember {
  id: string;
  guildId: string;
  userId: string;
  inviter: IInviter;
}

export interface IInviter {
  id: string;
  guildId: string;
  userId: string;
  totalInvitations: number;
  daysCounter: number;
  invalidAccount: boolean;
}

export interface ICreateInviter {
  id: string;
  guildId: string;
  userId: string;
  totalInvitations: number;
  daysCounter: number;
  invalidAccount: boolean;
  createdAt: Date;
  updatedAt: Date;
}

import { IInviter } from './inviter.interface';

export interface IInvitersPagination {
  page: number;
  size: number;
  totalInviters: number;
  inviters: IInviter[];
}

import { IInviter } from './inviter.interface';

export interface IInvitersDetails {
  page: number;
  size: number;
  totalInviters: number;
  inviters: IInviter[];
}

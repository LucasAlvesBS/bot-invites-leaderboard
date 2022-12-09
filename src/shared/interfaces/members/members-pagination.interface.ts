import { IMember } from './member.interface';

export interface IMembersPagination {
  page: number;
  size: number;
  totalMembers: number;
  members: IMember[];
}

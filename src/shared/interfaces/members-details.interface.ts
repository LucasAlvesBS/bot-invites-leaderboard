import { IMember } from './member.interface';

export interface IMembersDetails {
  page: number;
  size: number;
  totalMembers: number;
  members: IMember[];
}

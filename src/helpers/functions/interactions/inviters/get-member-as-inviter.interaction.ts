import { IInvitersDetails } from '@shared/interfaces/inviters-details.interface';

export const getMemberAsInviter = (data: IInvitersDetails, userId: string) => {
  for (let i = 0; i < data.inviters.length; i++) {
    if (data.inviters[i].userId === userId) {
      const memberIdAsInviter = data.inviters[i].id;
      return memberIdAsInviter;
    }
  }
};

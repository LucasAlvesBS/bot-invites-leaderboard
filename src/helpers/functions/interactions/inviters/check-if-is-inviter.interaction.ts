import { IInvitersPagination } from '@shared/interfaces/inviters/inviters-pagination.interface';

export const checkIfIsInviter = (data: IInvitersPagination, userId: string) => {
  for (let i = 0; i < data.inviters.length; i++) {
    if (data.inviters[i].userId === userId) {
      const inviterId = data.inviters[i].id;
      return inviterId;
    }
  }
};

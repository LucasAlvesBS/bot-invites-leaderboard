export const putInPluralOrSingular = (totalInvitations: number) => {
  if (totalInvitations === 0 || totalInvitations === 1) {
    return 'invite';
  } else {
    return 'invites';
  }
};

export const checkPosition = (position: number) => {
  if (position === 0) {
    return `*\`unranked\`*`;
  } else {
    return `\`#${position}\``;
  }
};

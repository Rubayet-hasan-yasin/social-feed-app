

import { AVATAR_COLORS } from '../constants/colors';

export const generateAvatarColor = (username: string): string => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};


export const getAvatarInitials = (username: string): string => {
  return username.slice(0, 2).toUpperCase();
};

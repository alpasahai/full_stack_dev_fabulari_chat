export interface User {
  id: string;
  username: string;
  role: 'superAdmin' | 'groupAdmin' | 'user';
  groupIds: string[];
  email?: string;
  dob?: string;
  avatarUrl?: string;
  theme?: string; // one of 'theme-1'..'theme-5' - see THEMES in signup.ts
}
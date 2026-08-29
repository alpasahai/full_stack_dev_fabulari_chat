export interface User {
  id: string;
  username: string;
  role: 'superAdmin' | 'groupAdmin' | 'user';
  groupIds: string[];
  email?: string;
  dob?: string;
}
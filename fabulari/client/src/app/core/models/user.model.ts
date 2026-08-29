export interface User {
  id: string;
  username: string;
  role: 'super_admin' | 'group_admin' | 'user';
  group_ids: string[];
}
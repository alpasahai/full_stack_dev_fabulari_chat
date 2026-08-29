export interface Group {
  id: string;
  name: string;
  adminId: string;      // groupAdmin user id
  memberIds: string[];  // user ids in this group
  channelIds: string[];
  status?: 'pending' | 'approved' | 'declined';
}
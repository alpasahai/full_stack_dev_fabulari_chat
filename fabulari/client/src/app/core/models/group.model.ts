export interface Group {
  id: string;
  name: string;
  adminId: string;      // groupAdmin user id
  memberIds: string[];  // user ids in this group
  pendingMemberIds: string[]; // users awaiting GA/SA approval to join
  channelIds: string[];
  status?: 'pending' | 'approved' | 'declined';
  minAge?: number;       // 0 or undefined = no age limit
}

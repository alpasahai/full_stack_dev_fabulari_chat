export interface Group {
  id: string;
  name: string;
  admin_id: string;      // groupAdmin user id
  member_ids: string[];  // user ids in this group
  channel_ids: string[];
}
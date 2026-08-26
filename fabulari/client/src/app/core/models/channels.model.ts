export interface Channel {
  id: string;
  name: string;
  group_d: string;   // which group this channel belongs to
  member_ids: string[];
}
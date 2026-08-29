export interface Channel {
  id: string;
  name: string;
  groupId: string;   // which group this channel belongs to
  memberIds: string[];
}
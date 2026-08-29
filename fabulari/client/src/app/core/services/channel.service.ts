import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Channel } from '../models/channels.model';

@Injectable({ providedIn: 'root' })
export class ChannelService {
  private apiUrl = 'http://localhost:3000/api/channels';

  constructor(private http: HttpClient) {}

  getChannels(groupId: string) {
    return this.http.get<Channel[]>(`${this.apiUrl}?groupId=${groupId}`);
  }

  createChannel(name: string, groupId: string) {
    return this.http.post<Channel>(this.apiUrl, { name, groupId, memberIds: [] });
  }

  addMember(channelId: string, userId: string) {
    return this.http.post<Channel>(`${this.apiUrl}/${channelId}/members`, { userId });
  }
}

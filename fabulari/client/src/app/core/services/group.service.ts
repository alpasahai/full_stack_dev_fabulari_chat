import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Group } from '../models/group.model';

@Injectable({ providedIn: 'root' })
export class GroupService {
  private apiUrl = 'http://localhost:3000/api/groups';

  constructor(private http: HttpClient) {}

  getGroups() { return this.http.get<Group[]>(this.apiUrl); }

  createGroup(name: string, adminId: string) {
    return this.http.post<Group>(this.apiUrl, { name, adminId });
  }

  updateStatus(groupId: string, status: 'approved' | 'declined') {
    return this.http.patch<Group>(`${this.apiUrl}/${groupId}/status`, { status });
  }

  addMember(groupId: string, userId: string) {
    return this.http.post<Group>(`${this.apiUrl}/${groupId}/members`, { userId });
  }
}
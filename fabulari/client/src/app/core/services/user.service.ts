import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })

export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  createUser(user: Partial<User> & { password: string; email?: string; dob?: string }) {
    return this.http.post<User>(this.apiUrl, user);
  }

  getUsers() { return this.http.get<User[]>(this.apiUrl); }
  getUser(id: string) { return this.http.get<User>(`${this.apiUrl}/${id}`); }
  updateUser(id: string, data: Partial<User>) { return this.http.patch<User>(`${this.apiUrl}/${id}`, data); }
}

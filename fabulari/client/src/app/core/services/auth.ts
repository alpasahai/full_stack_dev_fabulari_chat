import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<User>(`${this.apiUrl}/login`, { username, password });
  }

  saveSession(user: User) {
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    const raw = localStorage.getItem('current_user');
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  logout() {
    localStorage.removeItem('current_user');
    this.router.navigate(['/login']);
  }
}
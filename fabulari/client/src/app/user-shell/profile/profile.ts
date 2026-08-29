import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  user!: User & { email?: string };
  editing = false;
  editUsername = '';
  editEmail = '';

  constructor(private auth: AuthService, private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.user = this.auth.getCurrentUser()! as any;
    this.editUsername = this.user.username;
    this.editEmail = this.user.email || '';
  }

  //Enabling eddditing
  startEdit() { this.editing = true; }

  //Cancelling said editting
  cancelEdit() {
    this.editing = false;
    this.editUsername = this.user.username;
    this.editEmail = this.user.email || '';
  }

  //Saving Changes
  save() {
    this.userService.updateUser(this.user.id, {
      username: this.editUsername,
      email: this.editEmail
    } as any).subscribe(updated => {
      this.user = { ...this.user, ...updated };
      this.auth.saveSession(this.user);
      this.editing = false;
    });
  }

  //Retruning to previous page
  goBack() {
    if (this.user.role === 'superAdmin') this.router.navigate(['/superadmin/requests']);
    else this.router.navigate(['/app/dashboard']);
  }
}

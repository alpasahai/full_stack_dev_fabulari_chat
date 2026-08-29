import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupService } from '../../core/services/group.service';
import { AuthService } from '../../core/services/auth';
import { Group } from '../../core/models/group.model';

//see if you can rename to requestsSA for better clarity

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.scss',
})
export class ManageUsers implements OnInit {
  pendingGroups: Group[] = [];

  constructor(private groupService: GroupService, private auth: AuthService) {}

  ngOnInit() { this.loadPending(); }

  loadPending() {
    this.groupService.getGroups().subscribe(groups => {
      this.pendingGroups = groups.filter(g => g.status === 'pending');
    });
  }

  approve(group: Group) {
    this.groupService.updateStatus(group.id, 'approved').subscribe(() => this.loadPending());
  }

  deny(group: Group) {
    this.groupService.updateStatus(group.id, 'declined').subscribe(() => this.loadPending());
  }

  logout() { this.auth.logout(); }
}

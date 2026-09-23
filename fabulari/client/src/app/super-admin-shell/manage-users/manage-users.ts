import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupService, JoinRequest } from '../../core/services/group.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth';
import { Group } from '../../core/models/group.model';
 
//see if you can rename to requestsSA for better clarity
 
interface JoinRequestView extends JoinRequest {
  username: string;
}
 
@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.scss',
})
export class ManageUsers implements OnInit {
  private groupService = inject(GroupService);
  private userService = inject(UserService);
  private auth = inject(AuthService);
 
  pendingGroups = signal<Group[]>([]);
  joinRequests = signal<JoinRequestView[]>([]);
 
  ngOnInit() {
    this.loadPending();
    this.loadJoinRequests();
  }
 
  loadPending() {
    this.groupService.getGroups().subscribe(groups => {
      this.pendingGroups.set(groups.filter(g => g.status === 'pending'));
    });
  }
 
  // SA double-check view - every pending join request across every group,
  // in case a Group Admin hasn't actioned it yet.
  loadJoinRequests() {
    this.groupService.getAllJoinRequests().subscribe(requests => {
      if (!requests.length) {
        this.joinRequests.set([]);
        return;
      }
      this.userService.getUsers().subscribe(users => {
        const withNames = requests.map(r => ({
          ...r,
          username: users.find(u => u.id === r.userId)?.username || r.userId,
        }));
        this.joinRequests.set(withNames);
      });
    });
  }
 
  approve(group: Group) {
    this.groupService.updateStatus(group.id, 'approved').subscribe(() => this.loadPending());
  }
 
  deny(group: Group) {
    this.groupService.updateStatus(group.id, 'declined').subscribe(() => this.loadPending());
  }
 
  approveJoin(req: JoinRequestView) {
    this.groupService.respondToJoinRequest(req.groupId, req.userId, 'approve').subscribe(() => this.loadJoinRequests());
  }
 
  denyJoin(req: JoinRequestView) {
    this.groupService.respondToJoinRequest(req.groupId, req.userId, 'decline').subscribe(() => this.loadJoinRequests());
  }
 
  logout() { this.auth.logout(); }
}
 

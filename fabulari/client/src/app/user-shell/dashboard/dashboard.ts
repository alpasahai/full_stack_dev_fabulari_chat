import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
 
import { GroupService } from '../../core/services/group.service';
import { AuthService } from '../../core/services/auth';
import { Group } from '../../core/models/group.model';
import { User } from '../../core/models/user.model';
 
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private groupService = inject(GroupService);
  private auth = inject(AuthService);
  private router = inject(Router);
 
  currentUser!: User;
  newGroupName = '';
  newGroupMinAge: number | null = null;
  createGroupError = signal<string | null>(null);
  joinErrors = signal<Record<string, string>>({}); // groupId -> error message
 
  // raw data straight from the API
  private allGroups = signal<Group[]>([]);
 
  myGroups = computed(() =>
    this.allGroups().filter(g =>
      g.status === 'approved' && g.memberIds.includes(this.currentUser.id)
    )
  );
 
  // groups you can still ask to join - not a member, not already pending
  browseGroups = computed(() =>
    this.allGroups().filter(g =>
      g.status === 'approved' &&
      !g.memberIds.includes(this.currentUser.id) &&
      !g.pendingMemberIds?.includes(this.currentUser.id)
    )
  );
 
  // groups you've asked to join and are waiting on GA/SA approval for
  pendingGroups = computed(() =>
    this.allGroups().filter(g => g.pendingMemberIds?.includes(this.currentUser.id))
  );
 
  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser()!;
    this.loadGroups();
  }
 
  loadGroups() {
    this.groupService.getGroups().subscribe(groups => {
      this.allGroups.set(groups);
    });
  }
 
  createGroup() {
    if (!this.newGroupName.trim()) return;
    this.createGroupError.set(null);
 
    this.groupService.createGroup(this.newGroupName, this.currentUser.id, this.newGroupMinAge ?? 0).subscribe({
      next: () => {
        this.newGroupName = '';
        this.newGroupMinAge = null;
        this.loadGroups(); // Loads group when approved by SA
      },
      error: (err) => this.createGroupError.set(err.error?.message || 'Could not create group'),
    });
  }
 
  joinGroup(group: Group) {
    this.groupService.requestJoin(group.id, this.currentUser.id).subscribe({
      next: () => this.loadGroups(),
      error: (err) => {
        this.joinErrors.update(errs => ({
          ...errs,
          [group.id]: err.error?.message || 'Could not send join request',
        }));
      },
    });
  }
 
  openGroup(group: Group) {
    this.router.navigate(['/app/group', group.id]);
  }
 
  goToProfile() {
    this.router.navigate(['/app/profile']);
  }
 
  logout() {
    this.auth.logout();
  }
}
 
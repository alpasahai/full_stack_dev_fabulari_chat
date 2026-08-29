//THIS IS THE MAIN PAGE - it's just called dashboard
import { Component, OnInit } from '@angular/core';
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
  currentUser!: User;
  myGroups: Group[] = [];
  browseGroups: Group[] = [];
  newGroupName = '';

  constructor(
    private groupService: GroupService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser()!;
    this.loadGroups();
  }

  loadGroups() {
    this.groupService.getGroups().subscribe(groups => {
      this.myGroups = groups.filter(g =>
        g.status === 'approved' && g.memberIds.includes(this.currentUser.id)
      );
      this.browseGroups = groups.filter(g =>
        g.status === 'approved' && !g.memberIds.includes(this.currentUser.id)
      );
    });
  }

  createGroup() {
    if (!this.newGroupName.trim()) return;
    this.groupService.createGroup(this.newGroupName, this.currentUser.id).subscribe(() => {
      this.newGroupName = '';
      this.loadGroups(); //Loads group when approved by SA
    });
  }

  joinGroup(group: Group) {
    this.groupService.addMember(group.id, this.currentUser.id).subscribe(() => this.loadGroups());
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
//THIS IS THE MAIN PAGE - it's just called dashboard
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

//SOMETHING TO TAKE ALPAS STRESS
import { ChangeDetectorRef } from '@angular/core';

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
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser()!;
    this.loadGroups();
  }

  loadGroups() {
  this.groupService.getGroups().subscribe(groups => {
    // console.log('RAW GROUPS:', groups);
    // console.log('CURRENT USER:', JSON.stringify(this.currentUser));
    // console.log('CURRENT USER ID:', JSON.stringify(this.currentUser.id));
    // console.log('FIRST GROUP memberIds:', groups[0]?.memberIds);
    this.myGroups = groups.filter(g =>
      g.status === 'approved' && g.memberIds.includes(this.currentUser.id)
    );
    this.cdr.detectChanges(); // Force change detection after updating myGroups
    // console.log('FILTERED:', this.myGroups);
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
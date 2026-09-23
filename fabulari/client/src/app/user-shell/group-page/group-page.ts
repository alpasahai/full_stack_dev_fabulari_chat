import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { GroupService } from '../../core/services/group.service';
import { ChannelService } from '../../core/services/channel.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth';
import { Group } from '../../core/models/group.model';
import { Channel } from '../../core/models/channels.model';
import { User } from '../../core/models/user.model';

//SOMETHING TO TAKE ALPAS STRESS
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-group-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-page.html',
  styleUrl: './group-page.scss',
})
export class GroupPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private groupService = inject(GroupService);
  private channelService = inject(ChannelService);
  private userService = inject(UserService);
  private auth = inject(AuthService);
 
  group = signal<Group | null>(null);
  channels = signal<Channel[]>([]);
  members = signal<User[]>([]);
  pendingRequesters = signal<User[]>([]); // users awaiting this GA's approval to join
  currentUser!: User;
  is_GroupAdmin = false;
 
  selectedChannel = signal<Channel | null>(null);
  newChannelName = '';
  memberToAssign = '';
 
  //Mock chats for now lol
  mockMessages = [
    { username: 'tyra', time: '12:45pm', text: 'hey team, welcome to the channel!' },
    { username: 'ysa', time: '1:02pm', text: 'thanks! excited to be here' },
  ];
 
  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser()!;
    const groupId = this.route.snapshot.paramMap.get('id')!;
 
    this.groupService.getGroups().subscribe(groups => {
      const found = groups.find(g => g.id === groupId)!;
      this.group.set(found);
      this.is_GroupAdmin = found.adminId === this.currentUser.id;
      this.loadChannels(groupId);
      this.loadMembers();
    });
  }
 
  //Getting the channels ready
  loadChannels(groupId: string) {
    this.channelService.getChannels(groupId).subscribe(channels => {
      this.channels.set(channels);
      if (channels.length) this.selectedChannel.set(channels[0]);
    });
  }
 
  //Loading the Members that are in the room, plus anyone waiting on approval
  loadMembers() {
    this.userService.getUsers().subscribe(users => {
      const g = this.group();
      this.members.set(g ? users.filter(u => g.memberIds.includes(u.id)) : []);
      this.pendingRequesters.set(g ? users.filter(u => g.pendingMemberIds?.includes(u.id)) : []);
    });
  }
 
  approveJoinRequest(userId: string) {
    const g = this.group();
    if (!g) return;
    this.groupService.respondToJoinRequest(g.id, userId, 'approve').subscribe(updated => {
      this.group.set(updated);
      this.loadMembers();
    });
  }
 
  declineJoinRequest(userId: string) {
    const g = this.group();
    if (!g) return;
    this.groupService.respondToJoinRequest(g.id, userId, 'decline').subscribe(updated => {
      this.group.set(updated);
      this.loadMembers();
    });
  }
 
  selectChannel(channel: Channel) {
    this.selectedChannel.set(channel);
  }
 
  createChannel() {
    const g = this.group();
    if (!this.newChannelName.trim() || !g) return;
    this.channelService.createChannel(this.newChannelName, g.id).subscribe(() => {
      this.newChannelName = '';
      this.loadChannels(g.id);
    });
  }
 
  assignMember() {
    const sel = this.selectedChannel();
    if (!this.memberToAssign || !sel) return;
    this.channelService.addMember(sel.id, this.memberToAssign).subscribe(updated => {
      this.selectedChannel.set(updated);
      this.memberToAssign = '';
    });
  }
 
  memberName(id: string): string {
    return this.members().find(m => m.id === id)?.username || id;
  }
 
  goBack() {
    this.router.navigate(['/app/dashboard']);
  }
}
 
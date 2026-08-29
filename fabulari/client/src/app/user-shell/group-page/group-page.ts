import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-group-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-page.html',
  styleUrl: './group-page.scss',
})
export class GroupPage implements OnInit {
  group!: Group;
  channels: Channel[] = [];
  members: User[] = [];
  currentUser!: User;
  is_GroupAdmin = false;

  selectedChannel: Channel | null = null;
  newChannelName = '';
  memberToAssign = '';

  //Mock chats for now lol
  mockMessages = [
    { username: 'alpaca-05', time: '12:45pm', text: 'hey team, welcome to the channel!' },
    { username: 'ysa', time: '1:02pm', text: 'thanks! excited to be here' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService,
    private channelService: ChannelService,
    private userService: UserService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser()!;
    const groupId = this.route.snapshot.paramMap.get('id')!;

    this.groupService.getGroups().subscribe(groups => {
      this.group = groups.find(g => g.id === groupId)!;
      this.is_GroupAdmin = this.group.adminId === this.currentUser.id;
      this.loadChannels(groupId);
      this.loadMembers();
    });
  }

  //Getting the channels ready
  loadChannels(groupId: string) {
    this.channelService.getChannels(groupId).subscribe(channels => {
      this.channels = channels;
      if (channels.length) this.selectedChannel = channels[0];
    });
  }

  //Loading the Memebers that are in the room
  loadMembers() {
    this.userService.getUsers().subscribe(users => {
      this.members = users.filter(u => this.group.memberIds.includes(u.id));
    });
  }

  selectChannel(channel: Channel) {
    this.selectedChannel = channel;
  }

  createChannel() {
    if (!this.newChannelName.trim()) return;
    this.channelService.createChannel(this.newChannelName, this.group.id).subscribe(() => {
      this.newChannelName = '';
      this.loadChannels(this.group.id);
    });
  }

  assignMember() {
    if (!this.memberToAssign || !this.selectedChannel) return;
    this.channelService.addMember(this.selectedChannel.id, this.memberToAssign).subscribe(updated => {
      this.selectedChannel = updated;
      this.memberToAssign = '';
    });
  }

  memberName(id: string): string {
    return this.members.find(m => m.id === id)?.username || id;
  }

  goBack() {
    this.router.navigate(['/app/dashboard']);
  }
}

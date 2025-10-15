import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberService, Member } from '../member.service';
import { MemberCard } from '../member-card/member-card';

@Component({
  selector: 'ch-members',
  imports: [CommonModule, MemberCard],
  templateUrl: './members.html',
  styleUrl: './members.css',
})
export class Members implements OnInit {
  private memberService = inject(MemberService);

  members: Member[] = [];
  loading = true;
  error: string | null = null;

  get sortedMembers(): Member[] {
    return [...this.members].sort((a, b) => {
      // Active members first (true comes before false)
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      return 0;
    });
  }

  ngOnInit() {
    this.loadMembers();
  }

  private loadMembers() {
    this.loading = true;
    this.error = null;

    this.memberService.getMembers().subscribe({
      next: (members) => {
        this.members = members;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load members';
        this.loading = false;
        console.error('Error loading members:', error);
      },
    });
  }

  onStatusChanged(event: { id: string; active: boolean }) {
    // Update the local member data
    const member = this.members.find((m) => m.id === event.id);
    if (member) {
      member.isActive = event.active;
    }
  }

  onMemberRemoved(memberId: string) {
    this.members = this.members.filter((member) => member.id !== memberId);
  }

  refreshMembers() {
    this.loadMembers();
  }
}

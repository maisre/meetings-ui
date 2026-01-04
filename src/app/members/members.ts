import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MemberService, Member } from '../member.service';
import { MemberCard } from '../member-card/member-card';

@Component({
  selector: 'ch-members',
  imports: [CommonModule, FormsModule, MemberCard],
  templateUrl: './members.html',
  styleUrl: './members.css',
})
export class Members implements OnInit {
  private memberService = inject(MemberService);

  members: Member[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';
  showCreateForm = false;
  newMemberName = '';
  creating = false;

  get filteredMembers(): Member[] {
    if (!this.searchTerm.trim()) return this.members;
    const term = this.searchTerm.toLowerCase();
    return this.members.filter(m => m.name.toLowerCase().includes(term));
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

  onMemberRemoved(memberId: string) {
    this.members = this.members.filter((member) => member.id !== memberId);
  }

  refreshMembers() {
    this.loadMembers();
  }

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
    this.newMemberName = '';
  }

  createMember() {
    const name = this.newMemberName.trim();
    if (!name || this.creating) return;

    this.creating = true;
    this.memberService.createMember(name).subscribe({
      next: (member) => {
        this.members = [...this.members, member];
        this.newMemberName = '';
        this.showCreateForm = false;
        this.creating = false;
      },
      error: (error) => {
        console.error('Error creating member:', error);
        this.creating = false;
      },
    });
  }
}

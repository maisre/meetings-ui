import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member, MemberService } from '../member.service';

@Component({
  selector: 'ch-member-card',
  imports: [CommonModule],
  templateUrl: './member-card.html',
  styleUrl: './member-card.css',
})
export class MemberCard {
  @Input() member!: Member;
  @Output() statusChanged = new EventEmitter<{ id: string; active: boolean }>();
  @Output() memberRemoved = new EventEmitter<string>();

  private memberService = inject(MemberService);
  showConfirmation = false;

  toggleStatus() {
    const newStatus = !this.member.isActive;
    this.memberService.updateMemberStatus(this.member.id, newStatus).subscribe({
      next: (updatedMember) => {
        this.member = updatedMember;
        this.statusChanged.emit({ id: this.member.id, active: newStatus });
      },
      error: (error) => {
        console.error('Failed to update member status:', error);
      },
    });
  }

  removeMember() {
    if (!this.showConfirmation) {
      this.showConfirmation = true;
      return;
    }

    this.memberService.deleteMember(this.member.id).subscribe({
      next: () => {
        this.memberRemoved.emit(this.member.id);
      },
      error: (error) => {
        console.error('Failed to remove member:', error);
        alert('Failed to remove member. Please try again.');
        this.showConfirmation = false;
      },
    });
  }

  cancelRemoval() {
    this.showConfirmation = false;
  }
}

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
  @Output() memberRemoved = new EventEmitter<string>();

  private memberService = inject(MemberService);
  showConfirmation = false;

  removeMember() {
    if (!this.showConfirmation) {
      this.showConfirmation = true;
      return;
    }
    console.log(this.member);
    this.memberService.deleteMember(this.member._id).subscribe({
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

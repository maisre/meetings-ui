import { Component, inject } from '@angular/core';
import { MemberService } from '../member.service';

@Component({
  selector: 'ch-members',
  imports: [],
  templateUrl: './members.html',
  styleUrl: './members.css',
})
export class Members {
  private memberService = inject(MemberService);

  public test() {
    this.memberService.getMembers();
  }
}

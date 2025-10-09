import { Component, inject, OnInit } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { MeetingService } from '../meeting.service';
import { Meeting } from '../models/meeting.model';
import { MemberService } from '../member.service';

@Component({
  selector: 'ch-meetings',
  imports: [DatePipe, CommonModule],
  templateUrl: './meetings.html',
  styleUrl: './meetings.css',
})
export class Meetings implements OnInit {
  private meetingService = inject(MeetingService);
  private memberService = inject(MemberService);
  meetings: Meeting[] = [];
  members: { id: string; name: string }[] = [];

  ngOnInit() {
    this.memberService.getMembers().subscribe((res) => {
      this.members = res;
      this.meetingService.getMeetings().subscribe((res) => {
        res.forEach((meeting) => {
          // Replace invocation and benediction IDs with member names
          meeting.invocation =
            this.members.find((m) => m.id === meeting.invocation)?.name || meeting.invocation;
          meeting.benediction =
            this.members.find((m) => m.id === meeting.benediction)?.name || meeting.benediction;

          // Replace speaker IDs with member names
          meeting.speakers = meeting.speakers.map(
            (speakerId) => this.members.find((m) => m.id === speakerId)?.name || speakerId
          );
        });
        this.meetings = res.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });
    });
  }
}

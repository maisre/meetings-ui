import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MeetingService } from '../meeting.service';
import { MemberService } from '../member.service';
import { Meeting } from '../models/meeting.model';

@Component({
  selector: 'ch-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private authService = inject(AuthService);
  private meetingService = inject(MeetingService);
  private memberService = inject(MemberService);
  private router = inject(Router);

  isAuthenticated = false;
  upcomingMeetings: Meeting[] = [];
  members: { id: string; name: string }[] = [];
  loading = false;

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.loadData();
    }
  }

  private loadData(): void {
    this.loading = true;
    this.memberService.getMembers().subscribe({
      next: (members) => {
        this.members = members;
        this.loadUpcomingMeetings();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  private loadUpcomingMeetings(): void {
    this.meetingService.getUpcomingMeetings().subscribe({
      next: (meetings) => {
        meetings.forEach((meeting) => {
          meeting.invocation = this.getMemberName(meeting.invocation);
          meeting.benediction = this.getMemberName(meeting.benediction);
          meeting.speakers = meeting.speakers.map((id) => this.getMemberName(id));
        });
        this.upcomingMeetings = meetings;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  private getMemberName(memberId: string): string {
    return this.members.find((m) => m.id === memberId)?.name || memberId;
  }

  conductMeeting(meetingId: string): void {
    this.router.navigate(['/conduct', meetingId]);
  }

  editMeeting(meetingId: string): void {
    this.router.navigate(['/meetings'], { queryParams: { edit: meetingId } });
  }
}

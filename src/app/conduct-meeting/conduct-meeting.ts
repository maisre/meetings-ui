import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, CommonModule, TitleCasePipe } from '@angular/common';
import { MeetingService } from '../meeting.service';
import { MemberService } from '../member.service';
import { Meeting } from '../models/meeting.model';

interface AgendaItem {
  type: 'welcome' | 'invocation' | 'stake' | 'ward' | 'speaker' | 'benediction';
  title: string;
  subtitle?: string;
}

@Component({
  selector: 'ch-conduct-meeting',
  imports: [DatePipe, CommonModule, TitleCasePipe],
  templateUrl: './conduct-meeting.html',
  styleUrl: './conduct-meeting.css'
})
export class ConductMeeting implements OnInit {
  private route = inject(ActivatedRoute);
  private meetingService = inject(MeetingService);
  private memberService = inject(MemberService);

  meeting: Meeting | null = null;
  members: { id: string; name: string }[] = [];
  loading = true;
  agendaItems: AgendaItem[] = [];
  currentIndex = 0;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.memberService.getMembers().subscribe((members) => {
      this.members = members;
      this.meetingService.getMeeting(id).subscribe((meeting) => {
        meeting.invocation = this.getMemberName(meeting.invocation);
        meeting.benediction = this.getMemberName(meeting.benediction);
        meeting.speakers = meeting.speakers.map((s) => this.getMemberName(s));
        this.meeting = meeting;
        this.buildAgenda();
        this.loading = false;
      });
    });
  }

  private buildAgenda() {
    if (!this.meeting) return;

    // Welcome
    this.agendaItems.push({
      type: 'welcome',
      title: 'Welcome',
      subtitle: 'Welcome to Sacrament Meeting'
    });

    // Invocation
    this.agendaItems.push({
      type: 'invocation',
      title: 'Invocation',
      subtitle: this.meeting.invocation
    });

    // Stake Business
    this.meeting.stakeBusiness?.forEach((business) => {
      this.agendaItems.push({
        type: 'stake',
        title: 'Stake Business',
        subtitle: business
      });
    });

    // Ward Business
    this.meeting.wardBusiness?.forEach((business) => {
      this.agendaItems.push({
        type: 'ward',
        title: `Ward Business — ${business.type}`,
        subtitle: business.text
      });
    });

    // Speakers
    this.meeting.speakers?.forEach((speaker, index) => {
      this.agendaItems.push({
        type: 'speaker',
        title: index === 0 ? 'First Speaker' : index === this.meeting!.speakers.length - 1 ? 'Final Speaker' : `Speaker ${index + 1}`,
        subtitle: speaker
      });
    });

    // Benediction
    this.agendaItems.push({
      type: 'benediction',
      title: 'Benediction',
      subtitle: this.meeting.benediction
    });
  }

  goForward() {
    if (this.currentIndex < this.agendaItems.length) {
      this.currentIndex++;
    }
  }

  goBack() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  get previousItem(): AgendaItem | null {
    return this.currentIndex > 0 ? this.agendaItems[this.currentIndex - 1] : null;
  }

  get currentItem(): AgendaItem | null {
    return this.agendaItems[this.currentIndex] || null;
  }

  get nextItems(): AgendaItem[] {
    return this.agendaItems.slice(this.currentIndex + 1, this.currentIndex + 3);
  }

  get isComplete(): boolean {
    return this.currentIndex >= this.agendaItems.length;
  }

  get progress(): number {
    return this.agendaItems.length > 0 
      ? Math.round((this.currentIndex / this.agendaItems.length) * 100) 
      : 0;
  }

  reset() {
    this.currentIndex = 0;
  }

  private getMemberName(id: string): string {
    return this.members.find((m) => m.id === id)?.name || id;
  }
}

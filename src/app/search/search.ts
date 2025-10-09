import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MeetingService } from '../meeting.service';
import { MemberService } from '../member.service';

@Component({
  selector: 'ch-search',
  imports: [FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  private meetingService = inject(MeetingService);
  private memberService = inject(MemberService);
  public speakers: Array<{ date: Date; speaker: String }> = [];
  public prayers: Array<{ date: Date; prayer: String }> = [];
  public members: Array<{ id: String; name: String }> = [];
  public searchDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  public selectedDateRange: string = '1year';

  ngOnInit() {
    this.getInfo();
  }

  public getInfo() {
    this.meetingService.getPrayers().subscribe((res) => {
      this.prayers = res;
      console.log(res);
    });
    this.meetingService.getSpeakers().subscribe((res) => {
      this.speakers = res;
    });
    this.memberService.getMembers().subscribe((res) => {
      this.members = res;
    });
  }

  public dateChanged() {
    const now = new Date();
    let newDate: Date;

    switch (this.selectedDateRange) {
      case '3months':
        newDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case '6months':
        newDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      case '1year':
      default:
        newDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
    }

    this.searchDate = newDate;
    this.filterMembersAfterSearchDate();

    console.log('Date range changed to:', this.selectedDateRange, 'Search date:', this.searchDate);
  }

  public filterMembersAfterSearchDate() {
    // Find all speakers and prayers that happened after searchDate
    const speakersAfterDate = this.speakers.filter(
      (speaker) => new Date(speaker.date) > this.searchDate
    );
    const prayersAfterDate = this.prayers.filter(
      (prayer) => new Date(prayer.date) > this.searchDate
    );

    console.log('Speakers after date:', speakersAfterDate.length);
    console.log('Prayers after date:', prayersAfterDate.length);

    // Extract unique member names from speakers and prayers
    const activeMemberNames = new Set([
      ...speakersAfterDate.map((speaker) => speaker.speaker),
      ...prayersAfterDate.map((prayer) => prayer.prayer),
    ]);

    // Filter out members who have spoken or prayed after searchDate
    this.members = this.members.filter((member) => !activeMemberNames.has(member.id));

    console.log('Filtered members after search date:', this.searchDate);
    console.log('Active members (speakers/prayers after date):', Array.from(activeMemberNames));
    console.log('Remaining members:', this.members);
  }
}

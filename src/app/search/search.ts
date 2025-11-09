import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MeetingService } from '../meeting.service';
import { MemberService } from '../member.service';

@Component({
  selector: 'ch-search',
  imports: [FormsModule, CommonModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  private meetingService = inject(MeetingService);
  private memberService = inject(MemberService);
  public speakers: Array<{ date: Date; speaker: String }> = [];
  public prayers: Array<{ date: Date; prayer: String }> = [];
  public allMembers: Array<{ id: String; name: String }> = [];
  public filteredMembers: Array<{ id: String; name: String }> = [];
  public activeMembers: Array<{
    id: String;
    name: String;
    lastActivity: Date;
    activityType: string;
  }> = [];
  public searchDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  public selectedDateRange: string = '1year';
  public selectedFilterType: string = 'both';
  public isParticipatedSectionCollapsed: boolean = false;

  // Name search properties
  public autocompleteMembers: Array<{ id: String; name: String }> = [];
  public showNameDropdown: boolean = false;
  public selectedMember: { id: String; name: String } | null = null;
  public memberActivities: Array<{
    date: Date;
    type: 'Spoke' | 'Prayed';
  }> = [];
  public nameSearchQuery: string = '';

  ngOnInit() {
    this.getInfo();
  }

  public getInfo() {
    this.meetingService.getPrayers().subscribe((res) => {
      this.prayers = res;
      console.log(res);
      this.filterMembersAfterSearchDate();
    });
    this.meetingService.getSpeakers().subscribe((res) => {
      this.speakers = res;
      this.filterMembersAfterSearchDate();
    });
    this.memberService.getMembers().subscribe((res) => {
      this.allMembers = res;
      this.autocompleteMembers = [...this.allMembers];
      this.filterMembersAfterSearchDate();
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

  public filterTypeChanged() {
    this.filterMembersAfterSearchDate();
    console.log('Filter type changed to:', this.selectedFilterType);
  }

  public toggleParticipatedSection() {
    this.isParticipatedSectionCollapsed = !this.isParticipatedSectionCollapsed;
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

    // Build active members list with their last activity based on selected filter type
    this.activeMembers = [];
    const memberActivityMap = new Map<string, { lastActivity: Date; activityType: string }>();

    // Process activities based on selected filter type
    switch (this.selectedFilterType) {
      case 'speakers':
        // Only process speakers
        speakersAfterDate.forEach((speaker) => {
          const memberId = String(speaker.speaker);
          const activityDate = new Date(speaker.date);
          const existing = memberActivityMap.get(memberId);

          if (!existing || activityDate > existing.lastActivity) {
            memberActivityMap.set(memberId, { lastActivity: activityDate, activityType: 'Spoke' });
          }
        });
        break;
      case 'prayers':
        // Only process prayers
        prayersAfterDate.forEach((prayer) => {
          const memberId = String(prayer.prayer);
          const activityDate = new Date(prayer.date);
          const existing = memberActivityMap.get(memberId);

          if (!existing || activityDate > existing.lastActivity) {
            memberActivityMap.set(memberId, { lastActivity: activityDate, activityType: 'Prayed' });
          }
        });
        break;
      case 'both':
      default:
        // Process both speakers and prayers
        speakersAfterDate.forEach((speaker) => {
          const memberId = String(speaker.speaker);
          const activityDate = new Date(speaker.date);
          const existing = memberActivityMap.get(memberId);

          if (!existing || activityDate > existing.lastActivity) {
            memberActivityMap.set(memberId, { lastActivity: activityDate, activityType: 'Spoke' });
          }
        });

        prayersAfterDate.forEach((prayer) => {
          const memberId = String(prayer.prayer);
          const activityDate = new Date(prayer.date);
          const existing = memberActivityMap.get(memberId);

          if (!existing || activityDate > existing.lastActivity) {
            memberActivityMap.set(memberId, { lastActivity: activityDate, activityType: 'Prayed' });
          }
        });
        break;
    }

    // Convert to active members array with member names
    this.activeMembers = Array.from(memberActivityMap.entries())
      .map(([memberId, activity]) => {
        const member = this.allMembers.find((m) => String(m.id) === memberId);
        return {
          id: memberId,
          name: member ? member.name : memberId,
          lastActivity: activity.lastActivity,
          activityType: activity.activityType,
        };
      })
      .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());

    let activeMemberNames = new Set<string>();

    // Apply filtering based on selected filter type
    switch (this.selectedFilterType) {
      case 'speakers':
        // Only filter out members who have spoken after searchDate
        activeMemberNames = new Set(speakersAfterDate.map((speaker) => String(speaker.speaker)));
        break;
      case 'prayers':
        // Only filter out members who have prayed after searchDate
        activeMemberNames = new Set(prayersAfterDate.map((prayer) => String(prayer.prayer)));
        break;
      case 'both':
      default:
        // Filter out members who have either spoken or prayed after searchDate
        activeMemberNames = new Set([
          ...speakersAfterDate.map((speaker) => String(speaker.speaker)),
          ...prayersAfterDate.map((prayer) => String(prayer.prayer)),
        ]);
        break;
    }

    // Filter out members who have been active based on the selected filter type
    this.filteredMembers = this.allMembers.filter(
      (member) => !activeMemberNames.has(String(member.id))
    );

    console.log('Filtered members after search date:', this.searchDate);
    console.log('Filter type:', this.selectedFilterType);
    console.log('Active members:', Array.from(activeMemberNames));
    console.log('Remaining members:', this.filteredMembers);
  }

  // Name search methods
  public filterMembers(query: string): Array<{ id: String; name: String }> {
    if (!query) return this.allMembers;
    return this.allMembers.filter((member) =>
      member.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  public onNameInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const query = target.value;
    this.nameSearchQuery = query;
    this.autocompleteMembers = this.filterMembers(query);
    this.showNameDropdown = query.length > 0;
    if (query.length === 0) {
      this.selectedMember = null;
      this.memberActivities = [];
    }
  }

  public onNameBlur() {
    // Delay hiding dropdown to allow click events to fire
    setTimeout(() => {
      this.showNameDropdown = false;
    }, 200);
  }

  public selectMember(member: { id: String; name: String }) {
    this.selectedMember = member;
    this.nameSearchQuery = member.name as string;
    this.showNameDropdown = false;
    this.findMemberActivities(member.id);
  }

  public findMemberActivities(memberId: String) {
    const activities: Array<{ date: Date; type: 'Spoke' | 'Prayed' }> = [];

    // Find all speaking activities
    this.speakers.forEach((speaker) => {
      if (String(speaker.speaker) === String(memberId)) {
        activities.push({
          date: new Date(speaker.date),
          type: 'Spoke',
        });
      }
    });

    // Find all prayer activities
    this.prayers.forEach((prayer) => {
      if (String(prayer.prayer) === String(memberId)) {
        activities.push({
          date: new Date(prayer.date),
          type: 'Prayed',
        });
      }
    });

    // Sort by date, newest first
    this.memberActivities = activities.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
  }

  public getMemberName(memberId: String): string {
    const member = this.allMembers.find((m) => String(m.id) === String(memberId));
    return member ? (member.name as string) : '';
  }
}

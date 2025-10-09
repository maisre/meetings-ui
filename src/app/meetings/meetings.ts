import { Component, inject } from '@angular/core';
import { MeetingService } from '../meeting.service';

@Component({
  selector: 'ch-meetings',
  imports: [],
  templateUrl: './meetings.html',
  styleUrl: './meetings.css',
})
export class Meetings {
  private meetingService = inject(MeetingService);

  public test() {
    this.meetingService.getMeetings();
  }
}

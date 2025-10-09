import { Component, inject, OnInit } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MeetingService } from '../meeting.service';
import { Meeting } from '../models/meeting.model';
import { MemberService } from '../member.service';
import { WardBusinessItem, WardBusinessType } from '../models/wardbusiness';

@Component({
  selector: 'ch-meetings',
  imports: [DatePipe, CommonModule, ReactiveFormsModule],
  templateUrl: './meetings.html',
  styleUrl: './meetings.css',
})
export class Meetings implements OnInit {
  private meetingService = inject(MeetingService);
  private memberService = inject(MemberService);
  private fb = inject(FormBuilder);

  meetings: Meeting[] = [];
  members: { id: string; name: string }[] = [];
  meetingForm!: FormGroup;
  wardBusinessTypes = Object.values(WardBusinessType);
  showCreateForm = false;

  ngOnInit() {
    this.initializeForm();
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

  private initializeForm() {
    this.meetingForm = this.fb.group({
      date: ['', Validators.required],
      invocation: ['', Validators.required],
      benediction: ['', Validators.required],
      speakers: this.fb.array([this.fb.control('', Validators.required)]),
      wardBusiness: this.fb.array([]),
      stakeBusiness: this.fb.array([]),
    });
  }

  get speakers() {
    return this.meetingForm.get('speakers') as FormArray;
  }

  get wardBusiness() {
    return this.meetingForm.get('wardBusiness') as FormArray;
  }

  getWardBusinessGroup(index: number): FormGroup {
    return this.wardBusiness.at(index) as FormGroup;
  }

  get stakeBusiness() {
    return this.meetingForm.get('stakeBusiness') as FormArray;
  }

  addSpeaker() {
    this.speakers.push(this.fb.control('', Validators.required));
  }

  removeSpeaker(index: number) {
    this.speakers.removeAt(index);
  }

  addWardBusiness() {
    this.wardBusiness.push(
      this.fb.group({
        type: ['', Validators.required],
        text: ['', Validators.required],
      })
    );
  }

  removeWardBusiness(index: number) {
    this.wardBusiness.removeAt(index);
  }

  addStakeBusiness() {
    this.stakeBusiness.push(this.fb.control('', Validators.required));
  }

  removeStakeBusiness(index: number) {
    this.stakeBusiness.removeAt(index);
  }

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.meetingForm.reset();
      this.initializeForm();
    }
  }

  onSubmit() {
    if (this.meetingForm.valid) {
      const formValue = this.meetingForm.value;
      const meeting: Meeting = {
        date: new Date(formValue.date),
        invocation: formValue.invocation,
        benediction: formValue.benediction,
        speakers: formValue.speakers,
        wardBusiness: formValue.wardBusiness,
        stakeBusiness: formValue.stakeBusiness,
      };

      this.meetingService.createMeeting(meeting).subscribe(() => {
        this.toggleCreateForm();
        // Refresh meetings list
        this.ngOnInit();
      });
    }
  }
}

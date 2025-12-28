import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Meeting } from './models/meeting.model';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private http = inject(HttpClient);

  public getMeetings(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${environment.apiUrl}/meetings`);
  }

  public getSpeakers(): Observable<{ date: Date; speaker: string }[]> {
    return this.http.get<{ date: Date; speaker: string }[]>(
      `${environment.apiUrl}/meetings/speakers`
    );
  }

  public getPrayers(): Observable<{ date: Date; prayer: string }[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/meetings/prayers`);
  }

  public createMeeting(meeting: Meeting): Observable<Meeting> {
    return this.http.post<Meeting>(`${environment.apiUrl}/meetings`, meeting);
  }

  public updateMeeting(id: string, meeting: Meeting): Observable<Meeting> {
    return this.http.post<Meeting>(`${environment.apiUrl}/meetings/${id}`, meeting);
  }
}

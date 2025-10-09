import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private http = inject(HttpClient);

  public getMeetings() {
    this.http.get(`${environment.apiUrl}/meetings`).subscribe((res) => {
      console.log(res);
    });
  }

  public getSpeakers(): Observable<{ date: Date; speaker: string }[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/meetings/speakers`);
  }

  public getPrayers(): Observable<{ date: Date; prayer: string }[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/meetings/prayers`);
  }
}

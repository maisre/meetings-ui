import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private http = inject(HttpClient);

  public getMeetings() {
    this.http.get<{ access_token: string }>(`${environment.apiUrl}/meetings`).subscribe((res) => {
      console.log(res);
    });
  }
}

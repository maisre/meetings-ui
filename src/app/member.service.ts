import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);

  public getMembers() {
    this.http.get<{ access_token: string }>(`${environment.apiUrl}/members`).subscribe((res) => {
      console.log(res);
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

export interface Member {
  _id: string;
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);

  public getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${environment.apiUrl}/members`);
  }

  public deleteMember(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/members/${id}`);
  }

  public createMember(name: string): Observable<Member> {
    return this.http.post<Member>(`${environment.apiUrl}/members`, { name });
  }
}

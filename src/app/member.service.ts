import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

export interface Member {
  _id: string;
  id: string;
  name: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);

  public getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${environment.apiUrl}/members`);
  }

  public updateMemberStatus(id: string, active: boolean): Observable<Member> {
    return this.http.put<Member>(`${environment.apiUrl}/members/${id}`, { isActive: active });
  }

  public deleteMember(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/members/${id}`);
  }
}

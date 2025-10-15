import { inject, Injectable } from '@angular/core';
import { environment } from './../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private http = inject(HttpClient);
  private router = inject(Router);

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  login(username: string, password: string): void {
    this.http
      .post<{ access_token: string }>(`${environment.apiUrl}/auth/login`, {
        username: username,
        password: password,
      })
      .subscribe((res) => {
        console.log(res);
        this.setToken(res.access_token);
        this.router.navigate(['/home']);
      });
  }

  logout(): void {
    this.removeToken();
  }

  test(): void {
    this.http.get(`${environment.apiUrl}/profile`).subscribe((res) => {
      console.log(res);
    });
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'draxlmaier_token';
const USER_KEY = 'draxlmaier_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  get token(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  get username(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(USER_KEY);
  }

  saveSession(token: string, username: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, username);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export function apiUrl(path: string): string {
  return `${environment.apiUrl}${path}`;
}

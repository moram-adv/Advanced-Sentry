import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface UserSession {
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly isAuthenticated = signal<boolean>(false);
  readonly currentUser = signal<UserSession | null>(null);
  
  // MFA properties
  readonly activeOtp = signal<string>('');
  readonly otpTimeRemaining = signal<number>(30);
  private otpIntervalId: any = null;

  // Google Authenticator secret key for this mock user
  readonly googleAuthenticatorSecret = 'JBSWY3DPEHPK3PXP';
  
  constructor() {
    if (this.isBrowser) {
      const savedSession = localStorage.getItem('sentry-session');
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          this.currentUser.set(parsed);
          this.isAuthenticated.set(true);
        } catch {
          localStorage.removeItem('sentry-session');
        }
      }
    }
  }

  login(email: string, password: string): boolean {
    if (email === 'admin@sentry.com' && password === 'password') {
      this.generateNewOtp();
      this.startOtpTimer();
      return true;
    }
    return false;
  }

  verifyOtp(code: string): boolean {
    if (code === this.activeOtp() && this.activeOtp() !== '') {
      const session: UserSession = {
        email: 'admin@sentry.com',
        role: 'dispatcher'
      };
      this.currentUser.set(session);
      this.isAuthenticated.set(true);
      if (this.isBrowser) {
        localStorage.setItem('sentry-session', JSON.stringify(session));
      }
      this.stopOtpTimer();
      return true;
    }
    return false;
  }

  logout() {
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.activeOtp.set('');
    this.stopOtpTimer();
    if (this.isBrowser) {
      localStorage.removeItem('sentry-session');
    }
  }

  private generateNewOtp() {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    this.activeOtp.set(randomCode);
    this.otpTimeRemaining.set(30);
    console.log(`[Advanced Sentry MFA] Active Google Authenticator OTP: ${randomCode}`);
  }

  private startOtpTimer() {
    this.stopOtpTimer();
    if (this.isBrowser) {
      this.otpIntervalId = setInterval(() => {
        const remaining = this.otpTimeRemaining();
        if (remaining <= 1) {
          this.generateNewOtp();
        } else {
          this.otpTimeRemaining.set(remaining - 1);
        }
      }, 1000);
    }
  }

  private stopOtpTimer() {
    if (this.otpIntervalId) {
      clearInterval(this.otpIntervalId);
      this.otpIntervalId = null;
    }
  }
}

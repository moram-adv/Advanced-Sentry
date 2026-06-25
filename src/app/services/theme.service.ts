import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  
  readonly theme = signal<'light' | 'dark'>('light');

  constructor() {
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('sentry-theme') as 'light' | 'dark' | null;
      if (savedTheme) {
        this.setTheme(savedTheme);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.setTheme(prefersDark ? 'dark' : 'light');
      }
    }
  }

  toggleTheme() {
    this.setTheme(this.theme() === 'light' ? 'dark' : 'light');
  }

  setTheme(newTheme: 'light' | 'dark') {
    this.theme.set(newTheme);
    if (this.isBrowser) {
      localStorage.setItem('sentry-theme', newTheme);
      if (newTheme === 'dark') {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }
  }
}

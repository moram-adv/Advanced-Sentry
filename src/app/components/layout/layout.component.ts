import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="portal-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-brand">
          <!-- Logo Shield SVG -->
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="brand-logo"><path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6z"/><path d="M12 22V2"/></svg>
          <span class="brand-name">SENTRY</span>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <!-- Dashboard Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            <span>Dashboard</span>
          </a>

          <a class="nav-item disabled-link">
            <!-- Location Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>Locations</span>
            <span class="badge">Soon</span>
          </a>

          <a class="nav-item disabled-link">
            <!-- Checklist Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11-6 6v3h9l3-3"/><path d="m16 2 6 6-11 11H5v-6z"/><path d="m14 4 6 6"/></svg>
            <span>Templates</span>
            <span class="badge">Soon</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="user-profile">
            <div class="user-avatar">
              <span>A</span>
            </div>
            <div class="user-info">
              <p class="user-email">{{ authService.currentUser()?.email }}</p>
              <p class="user-role">{{ authService.currentUser()?.role?.toUpperCase() }}</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Panel -->
      <div class="main-panel">
        <!-- Header -->
        <header class="header">
          <div class="header-left">
            <h1>Dashboard</h1>
          </div>
          
          <div class="header-actions">
            <!-- Theme Toggle -->
            <button class="header-btn" (click)="themeService.toggleTheme()" aria-label="Toggle Theme">
              @if (themeService.theme() === 'light') {
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              }
            </button>

            <!-- Logout Button -->
            <button class="logout-btn" (click)="onLogout()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              <span>Logout</span>
            </button>
          </div>
        </header>

        <!-- Main Content Area -->
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .portal-layout {
      display: flex;
      min-height: 100vh;
      background-color: var(--bg-canvas);
    }

    /* Sidebar Styles */
    .sidebar {
      width: 240px;
      background-color: var(--bg-card);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      transition: background-color 0.2s, border-color 0.2s;
    }

    .sidebar-brand {
      padding: 1.5rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-bottom: 1px solid var(--border-color);

      .brand-logo {
        color: var(--text-primary);
      }

      .brand-name {
        font-weight: 700;
        font-size: 1.125rem;
        letter-spacing: 0.05em;
        color: var(--text-primary);
      }
    }

    .sidebar-nav {
      flex: 1;
      padding: 1.5rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      transition: background-color 0.15s, color 0.15s;
      cursor: pointer;

      &:hover:not(.disabled-link) {
        background-color: var(--bg-canvas);
        color: var(--text-primary);
      }

      &.active {
        background-color: var(--accent-primary);
        color: var(--accent-text);
      }
    }

    .disabled-link {
      cursor: not-allowed;
      opacity: 0.6;
      display: flex;
      justify-content: space-between;
      align-items: center;

      div {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
    }

    .badge {
      font-size: 0.625rem;
      background-color: var(--border-color);
      color: var(--text-secondary);
      padding: 0.125rem 0.375rem;
      border-radius: 999px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .sidebar-footer {
      padding: 1.25rem;
      border-top: 1px solid var(--border-color);
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: var(--border-color);
      color: var(--text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .user-info {
      overflow: hidden;
      
      .user-email {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--text-primary);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .user-role {
        font-size: 0.625rem;
        color: var(--text-secondary);
        font-weight: 600;
        margin-top: 0.125rem;
      }
    }

    /* Main Panel Styles */
    .main-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .header {
      height: 64px;
      background-color: var(--bg-card);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      transition: background-color 0.2s, border-color 0.2s;

      h1 {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-primary);
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header-btn {
      background: none;
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      width: 32px;
      height: 32px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.15s, border-color 0.15s;

      &:hover {
        background-color: var(--bg-canvas);
      }
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 0.375rem 0.75rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8125rem;
      font-weight: 500;
      transition: background-color 0.15s, border-color 0.15s;

      &:hover {
        background-color: var(--bg-canvas);
      }
    }

    .content {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }
  `]
})
export class LayoutComponent {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

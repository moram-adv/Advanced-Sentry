import { Component, signal } from '@angular/core';

interface DashboardStat {
  title: string;
  value: number;
  description: string;
  iconSvg: string;
}

interface ActivityLog {
  id: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="dashboard-page">
      <!-- Welcome Header -->
      <div class="welcome-banner">
        <h2>Welcome back, Controller</h2>
        <p>Here is an overview of the SENTRY platform status today.</p>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        @for (stat of stats(); track stat.title) {
          <div class="sentry-card stat-card">
            <div class="stat-header">
              <span class="stat-title">{{ stat.title }}</span>
              <div [innerHTML]="stat.iconSvg" class="stat-icon"></div>
            </div>
            <div class="stat-value">{{ stat.value }}</div>
            <p class="stat-desc">{{ stat.description }}</p>
          </div>
        }
      </div>

      <!-- Quick Actions & Recent Activity -->
      <div class="dashboard-details">
        <!-- Quick Actions Card -->
        <div class="sentry-card details-card">
          <h3>Quick Operations</h3>
          <p class="section-desc">Common administrative tasks for dispatchers.</p>
          
          <div class="actions-list">
            <button class="sentry-button-primary action-btn disabled-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Add New Location (Phase 1)</span>
            </button>
            
            <button class="sentry-button-secondary action-btn disabled-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11-6 6v3h9l3-3"/><path d="m16 2 6 6-11 11H5v-6z"/><path d="m14 4 6 6"/></svg>
              <span>Create Checklist Template</span>
            </button>
          </div>
        </div>

        <!-- Recent Activity Card -->
        <div class="sentry-card details-card">
          <h3>System Event Logs</h3>
          <p class="section-desc">Recent security and dispatcher activities.</p>
          
          <div class="activity-list">
            @for (log of activities(); track log.id) {
              <div class="activity-item">
                <span class="status-indicator" [class]="log.type"></span>
                <div class="activity-content">
                  <p class="activity-message">{{ log.message }}</p>
                  <p class="activity-time">{{ log.time }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .welcome-banner {
      h2 {
        font-size: 1.5rem;
        font-weight: 600;
        letter-spacing: -0.025em;
        color: var(--text-primary);
      }

      p {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin-top: 0.25rem;
      }
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stat-title {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
    }

    .stat-icon {
      color: var(--text-secondary);
      display: flex;
      align-items: center;
    }

    .stat-value {
      font-size: 2.25rem;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.05em;
    }

    .stat-desc {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    /* Details Layout */
    .dashboard-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .details-card {
      padding: 1.75rem 1.5rem;
      display: flex;
      flex-direction: column;

      h3 {
        font-size: 1.05rem;
        font-weight: 600;
        color: var(--text-primary);
      }

      .section-desc {
        font-size: 0.75rem;
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
      }
    }

    .actions-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
    }

    .disabled-btn {
      opacity: 0.55;
      cursor: not-allowed;
      
      &:hover {
        background-color: inherit;
        color: inherit;
      }
    }

    /* Activity List */
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-top: 0.375rem;
      flex-shrink: 0;

      &.info {
        background-color: #3b82f6;
      }

      &.success {
        background-color: #10b981;
      }

      &.warning {
        background-color: #f59e0b;
      }
    }

    .activity-content {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .activity-message {
      font-size: 0.8125rem;
      color: var(--text-primary);
      line-height: 1.4;
    }

    .activity-time {
      font-size: 0.7rem;
      color: var(--text-secondary);
    }
  `]
})
export class DashboardComponent {
  stats = signal<DashboardStat[]>([
    {
      title: 'Active Locations',
      value: 0,
      description: 'Total monitored customer properties',
      iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
    },
    {
      title: 'Checklist Templates',
      value: 0,
      description: 'Standardized task templates configured',
      iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11-6 6v3h9l3-3"/><path d="m16 2 6 6-11 11H5v-6z"/><path d="m14 4 6 6"/></svg>'
    }
  ]);

  activities = signal<ActivityLog[]>([
    {
      id: '1',
      message: 'MFA Google Authenticator verified for Dispatcher.',
      time: 'Just now',
      type: 'success'
    },
    {
      id: '2',
      message: 'Dispatcher session initialized on device.',
      time: '2 minutes ago',
      type: 'info'
    },
    {
      id: '3',
      message: 'Initial project repository structure configured.',
      time: '1 hour ago',
      type: 'info'
    }
  ]);
}

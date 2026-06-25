import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-container">
      <div class="theme-switch-container">
        <button class="theme-toggle-btn" (click)="themeService.toggleTheme()" aria-label="Toggle Theme">
          @if (themeService.theme() === 'light') {
            <!-- Sun Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          } @else {
            <!-- Moon Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          }
        </button>
      </div>

      <div class="sentry-card login-card">
        <div class="card-header">
          <!-- Logo Shield SVG -->
          <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6z"/><path d="M12 22V2"/></svg>
          <h2>Advanced SENTRY</h2>
          <p class="subtitle">Admin Portal Control Center</p>
        </div>

        @if (errorMessage()) {
          <div class="error-banner">
            <svg class="error-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <span>{{ errorMessage() }}</span>
          </div>
        }

        @if (step() === 'credentials') {
          <form (submit)="onSubmitCredentials($event)">
            <div class="form-group">
              <label for="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                class="sentry-input" 
                placeholder="name@company.com" 
                [(ngModel)]="email" 
                required
                autocomplete="username"
              />
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password"
                class="sentry-input" 
                placeholder="••••••••" 
                [(ngModel)]="password" 
                required
                autocomplete="current-password"
              />
            </div>

            <button type="submit" class="sentry-button-primary submit-btn">
              Continue
            </button>
            
            <div class="form-footer">
              <p>Demo Credentials: <code>admin@sentry.com</code> / <code>password</code></p>
            </div>
          </form>
        } @else {
          <form (submit)="onSubmitOtp($event)">
            <div class="mfa-section">
              <p class="mfa-desc">Scan the QR code with your Google Authenticator app, or enter the secret key below.</p>
              
              <div class="qr-container">
                <!-- SVG Custom QR Code Mockup -->
                <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" class="qr-svg">
                  <rect width="140" height="140" rx="8" fill="var(--bg-canvas)" />
                  <!-- QR Corners -->
                  <rect x="15" y="15" width="30" height="30" fill="var(--text-primary)" />
                  <rect x="23" y="23" width="14" height="14" fill="var(--bg-card)" />
                  
                  <rect x="95" y="15" width="30" height="30" fill="var(--text-primary)" />
                  <rect x="103" y="23" width="14" height="14" fill="var(--bg-card)" />
                  
                  <rect x="15" y="95" width="30" height="30" fill="var(--text-primary)" />
                  <rect x="23" y="103" width="14" height="14" fill="var(--bg-card)" />
                  <!-- Mock QR Patterns -->
                  <rect x="55" y="15" width="10" height="15" fill="var(--text-primary)" />
                  <rect x="75" y="25" width="10" height="10" fill="var(--text-primary)" />
                  <rect x="55" y="45" width="20" height="10" fill="var(--text-primary)" />
                  <rect x="95" y="55" width="15" height="10" fill="var(--text-primary)" />
                  <rect x="15" y="55" width="10" height="25" fill="var(--text-primary)" />
                  <rect x="35" y="65" width="25" height="10" fill="var(--text-primary)" />
                  <rect x="75" y="75" width="25" height="15" fill="var(--text-primary)" />
                  <rect x="110" y="95" width="15" height="15" fill="var(--text-primary)" />
                  <rect x="55" y="110" width="20" height="15" fill="var(--text-primary)" />
                  <rect x="95" y="120" width="10" height="5" fill="var(--text-primary)" />
                  <!-- Google Authenticator Shield Mock Icon in center -->
                  <rect x="58" y="58" width="24" height="24" rx="4" fill="var(--text-primary)" />
                  <circle cx="70" cy="70" r="7" fill="var(--bg-card)" />
                  <path d="M70 66v8M66 70h8" stroke="var(--text-primary)" stroke-width="2"/>
                </svg>
              </div>

              <div class="secret-box">
                <span class="secret-label">Secret Key:</span>
                <code class="secret-value">{{ authService.googleAuthenticatorSecret }}</code>
              </div>

              <div class="form-group">
                <label for="otp">Authenticator Code</label>
                <input 
                  type="text" 
                  id="otp" 
                  name="otp"
                  class="sentry-input otp-input" 
                  placeholder="000000" 
                  maxlength="6"
                  pattern="[0-9]*"
                  inputmode="numeric"
                  [(ngModel)]="otp" 
                  required
                  autoFocus
                  autocomplete="one-time-code"
                />
              </div>

              <!-- Real-time mock code visual notifier for easy client demonstration -->
              <div class="otp-simulator-alert">
                <div class="simulator-header">
                  <span class="pulse-indicator"></span>
                  <span class="simulator-title">Google Authenticator (Simulated)</span>
                </div>
                <div class="simulator-body">
                  <span class="simulated-code">{{ authService.activeOtp() }}</span>
                  <div class="timer-container">
                    <span class="time-remaining">{{ authService.otpTimeRemaining() }}s</span>
                    <div class="progress-bar-bg">
                      <div class="progress-bar-fill" [style.width.%]="(authService.otpTimeRemaining() / 30) * 100"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mfa-actions">
                <button type="button" class="sentry-button-secondary" (click)="onCancelMfa()">
                  Cancel
                </button>
                <button type="submit" class="sentry-button-primary">
                  Verify & Log In
                </button>
              </div>
            </div>
          </form>
        }
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 1.5rem;
      background-color: var(--bg-canvas);
      transition: background-color 0.2s ease;
    }

    .theme-switch-container {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
    }

    .theme-toggle-btn {
      background: none;
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 0.5rem;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.15s, border-color 0.15s;

      &:hover {
        background-color: var(--border-color);
      }
    }

    .login-card {
      width: 100%;
      max-width: 440px;
      padding: 2.5rem 2rem;
    }

    .card-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo-icon {
      color: var(--text-primary);
      margin-bottom: 0.75rem;
    }

    h2 {
      font-size: 1.375rem;
      font-weight: 600;
      color: var(--text-primary);
      letter-spacing: -0.025em;
    }

    .subtitle {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-top: 0.25rem;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 6px;
      padding: 0.75rem;
      margin-bottom: 1.5rem;
      color: #ef4444;
      font-size: 0.8125rem;

      .error-icon {
        flex-shrink: 0;
      }
    }

    .form-group {
      margin-bottom: 1.25rem;

      label {
        display: block;
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
      }
    }

    .submit-btn {
      margin-top: 0.75rem;
    }

    .form-footer {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.75rem;
      color: var(--text-secondary);

      code {
        background-color: var(--bg-canvas);
        padding: 0.125rem 0.25rem;
        border-radius: 4px;
        font-family: monospace;
      }
    }

    /* MFA Styles */
    .mfa-section {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .mfa-desc {
      font-size: 0.8125rem;
      color: var(--text-secondary);
      text-align: center;
      line-height: 1.4;
      margin-bottom: 1.5rem;
    }

    .qr-container {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 0.5rem;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .qr-svg {
      display: block;
    }

    .secret-box {
      font-size: 0.8125rem;
      margin-bottom: 1.5rem;
      text-align: center;
      background-color: var(--bg-canvas);
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      border: 1px solid var(--border-color);
      width: 100%;

      .secret-label {
        color: var(--text-secondary);
        margin-right: 0.5rem;
      }

      .secret-value {
        font-weight: 600;
        font-family: monospace;
        letter-spacing: 0.05em;
      }
    }

    .otp-input {
      text-align: center;
      font-size: 1.25rem;
      letter-spacing: 0.25em;
      font-weight: 600;
      padding: 0.75rem;
    }

    .otp-simulator-alert {
      width: 100%;
      border: 1px solid var(--border-color);
      background-color: var(--bg-card);
      border-radius: 6px;
      padding: 0.75rem;
      margin-bottom: 1.5rem;
      box-shadow: var(--shadow-sm);
    }

    .simulator-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .pulse-indicator {
      width: 6px;
      height: 6px;
      background-color: #10b981;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }

    .simulator-body {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .simulated-code {
      font-size: 1.25rem;
      font-weight: 700;
      font-family: monospace;
      letter-spacing: 0.05em;
      color: var(--text-primary);
    }

    .timer-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .progress-bar-bg {
      width: 60px;
      height: 4px;
      background-color: var(--border-color);
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      background-color: var(--text-primary);
      border-radius: 2px;
      transition: width 1s linear;
    }

    .mfa-actions {
      display: flex;
      gap: 0.75rem;
      width: 100%;
      margin-top: 0.5rem;

      button {
        flex: 1;
      }
    }

    @keyframes pulse {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      }
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 4px rgba(16, 185, 129, 0);
      }
      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
      }
    }
  `]
})
export class LoginComponent {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  email = 'admin@sentry.com';
  password = 'password';
  otp = '';

  step = signal<'credentials' | 'mfa'>('credentials');
  errorMessage = signal<string>('');

  onSubmitCredentials(event: Event) {
    event.preventDefault();
    this.errorMessage.set('');

    if (this.authService.login(this.email, this.password)) {
      this.step.set('mfa');
      this.otp = '';
    } else {
      this.errorMessage.set('Invalid email address or password.');
    }
  }

  onSubmitOtp(event: Event) {
    event.preventDefault();
    this.errorMessage.set('');

    if (this.authService.verifyOtp(this.otp)) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage.set('Invalid Google Authenticator code. Please try again.');
    }
  }

  onCancelMfa() {
    this.step.set('credentials');
    this.errorMessage.set('');
  }
}

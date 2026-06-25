import { Component, signal, inject, effect } from '@angular/core';
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          }
        </button>
      </div>

      <div class="sentry-card login-card">
        <div class="card-header">
          <!-- Elegant minimalist Shield Icon -->
          <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <h2>Advanced SENTRY</h2>
          <p class="subtitle">Admin Portal Control Center</p>
        </div>

        @if (errorMessage()) {
          <div class="error-banner">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <span>{{ errorMessage() }}</span>
          </div>
        }

        @if (step() === 'credentials') {
          <form (submit)="onSubmitCredentials($event)">
            <div class="form-group">
              <label for="email">Email address</label>
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
              <div class="label-wrapper">
                <label for="password">Password</label>
                <a href="#" class="forgot-link" (click)="$event.preventDefault()">Forgot?</a>
              </div>
              <input 
                type="password" 
                id="password" 
                name="password"
                class="sentry-input" 
                placeholder="Password" 
                [(ngModel)]="password" 
                required
                autocomplete="current-password"
              />
            </div>

            <button type="submit" class="sentry-button-primary submit-btn">
              Continue
            </button>
            
            <div class="form-footer">
              <p>Demo account: <code>admin@sentry.com</code> / <code>password</code></p>
            </div>
          </form>
        } @else {
          <form (submit)="onSubmitOtp($event)">
            <div class="mfa-section">
              <p class="mfa-desc">Scan this QR code with Google Authenticator or enter the secret key manually.</p>
              
              <!-- Clean High Contrast QR Code -->
              <div class="qr-wrapper">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="qr-svg">
                  <rect width="120" height="120" rx="6" fill="#FFFFFF" />
                  <!-- QR Patterns in Crisp Black -->
                  <rect x="12" y="12" width="24" height="24" fill="#0F172A" />
                  <rect x="18" y="18" width="12" height="12" fill="#FFFFFF" />
                  
                  <rect x="84" y="12" width="24" height="24" fill="#0F172A" />
                  <rect x="90" y="18" width="12" height="12" fill="#FFFFFF" />
                  
                  <rect x="12" y="84" width="24" height="24" fill="#0F172A" />
                  <rect x="18" y="90" width="12" height="12" fill="#FFFFFF" />
                  <!-- Inner bits -->
                  <rect x="48" y="12" width="8" height="12" fill="#0F172A" />
                  <rect x="64" y="20" width="8" height="8" fill="#0F172A" />
                  <rect x="48" y="36" width="16" height="8" fill="#0F172A" />
                  <rect x="84" y="44" width="12" height="8" fill="#0F172A" />
                  <rect x="12" y="48" width="8" height="20" fill="#0F172A" />
                  <rect x="28" y="56" width="20" height="8" fill="#0F172A" />
                  <rect x="64" y="64" width="20" height="12" fill="#0F172A" />
                  <rect x="96" y="80" width="12" height="12" fill="#0F172A" />
                  <rect x="48" y="96" width="16" height="12" fill="#0F172A" />
                  <!-- Center Shield badge -->
                  <rect x="48" y="48" width="24" height="24" rx="4" fill="#0F172A" />
                  <circle cx="60" cy="60" r="6" fill="#FFFFFF" />
                  <path d="M60 57v6M57 60h6" stroke="#0F172A" stroke-width="1.5"/>
                </svg>
              </div>

              <!-- Sleek manual secret key -->
              <div class="secret-badge">
                <span class="badge-label">Secret Key:</span>
                <code class="badge-value">{{ authService.googleAuthenticatorSecret }}</code>
              </div>

              <!-- High Fidelity 6-Digit OTP Box Grid -->
              <div class="form-group otp-group">
                <label>Verification Code</label>
                <div class="otp-boxes-wrapper">
                  @for (idx of [0, 1, 2, 3, 4, 5]; track idx) {
                    <div class="otp-digit-box" 
                      [class.focused]="otp.length === idx" 
                      [class.has-val]="otp.length > idx">
                      {{ otp[idx] || '' }}
                    </div>
                  }
                  <input 
                    type="text" 
                    maxlength="6"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    class="otp-hidden-input"
                    [(ngModel)]="otp" 
                    name="otpValue"
                    required
                    autocomplete="one-time-code"
                    autoFocus
                  />
                </div>
              </div>

              <!-- Beautiful Authenticator App Token Simulator widget -->
              <div class="app-simulator-widget">
                <div class="sim-header">
                  <div class="sim-brand">
                    <span class="active-dot"></span>
                    <span>Authenticator App Token</span>
                  </div>
                  <button type="button" class="copy-code-btn" (click)="copyCode()" aria-label="Copy Code">
                    @if (isCopied()) {
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span class="copied-txt">Copied!</span>
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    }
                  </button>
                </div>
                <div class="sim-content">
                  <span class="sim-code">{{ formatCode(authService.activeOtp()) }}</span>
                  <div class="sim-timer">
                    <span class="sim-seconds">{{ authService.otpTimeRemaining() }}s</span>
                    <!-- Circular SVG Countdown timer -->
                    <svg width="20" height="20" class="circle-svg">
                      <circle cx="10" cy="10" r="8" class="circle-bg" />
                      <circle cx="10" cy="10" r="8" class="circle-fill" 
                        [style.strokeDashoffset]="getStrokeOffset()" />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="mfa-actions">
                <button type="button" class="sentry-button-secondary" (click)="onCancelMfa()">
                  Cancel
                </button>
                <button type="submit" class="sentry-button-primary" [disabled]="otp.length !== 6">
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
      position: relative;
    }

    .theme-switch-container {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
    }

    .theme-toggle-btn {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      width: 36px;
      height: 36px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-sm);
      transition: all 0.15s ease;

      &:hover {
        background-color: var(--bg-canvas);
        border-color: var(--text-secondary);
      }
    }

    .login-card {
      width: 100%;
      max-width: 390px;
      border-radius: 12px;
    }

    .card-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo-icon {
      color: var(--text-primary);
      margin-bottom: 0.75rem;
    }

    h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      letter-spacing: -0.025em;
    }

    .subtitle {
      font-size: 0.8125rem;
      color: var(--text-secondary);
      margin-top: 0.25rem;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: rgba(239, 68, 68, 0.05);
      border: 1px solid rgba(239, 68, 68, 0.15);
      border-radius: 6px;
      padding: 0.625rem 0.75rem;
      margin-bottom: 1.25rem;
      color: #ef4444;
      font-size: 0.75rem;

      svg {
        flex-shrink: 0;
      }
    }

    .form-group {
      margin-bottom: 1.25rem;
      position: relative;

      label {
        display: block;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--text-secondary);
        margin-bottom: 0.375rem;
      }
    }

    .label-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.375rem;

      label {
        margin-bottom: 0;
      }
    }

    .forgot-link {
      font-size: 0.75rem;
      color: var(--text-secondary);
      text-decoration: none;
      
      &:hover {
        color: var(--text-primary);
        text-decoration: underline;
      }
    }

    .submit-btn {
      width: 100%;
      margin-top: 0.5rem;
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
        color: var(--text-primary);
        border: 1px solid var(--border-color);
      }
    }

    /* Clean MFA Styles */
    .mfa-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .mfa-desc {
      font-size: 0.75rem;
      color: var(--text-secondary);
      text-align: center;
      line-height: 1.4;
      margin-bottom: 1.25rem;
    }

    .qr-wrapper {
      background-color: #FFFFFF;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 0.625rem;
      margin-bottom: 1rem;
      box-shadow: var(--shadow-sm);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .qr-svg {
      display: block;
    }

    .secret-badge {
      font-size: 0.75rem;
      background-color: var(--bg-canvas);
      padding: 0.375rem 0.625rem;
      border-radius: 6px;
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      width: 100%;

      .badge-label {
        color: var(--text-secondary);
      }

      .badge-value {
        font-weight: 600;
        font-family: monospace;
        color: var(--text-primary);
      }
    }

    /* Custom 6-Digit OTP Box Grid */
    .otp-group {
      width: 100%;
      text-align: center;

      label {
        text-align: left;
      }
    }

    .otp-boxes-wrapper {
      position: relative;
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      width: 100%;
      margin-top: 0.25rem;
    }

    .otp-digit-box {
      flex: 1;
      height: 44px;
      border-radius: 6px;
      border: 1px solid var(--input-border);
      background-color: var(--input-bg);
      color: var(--text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.125rem;
      font-weight: 600;
      font-family: monospace;
      transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: var(--shadow-sm);

      &.focused {
        border-color: var(--input-focus-border);
        box-shadow: 0 0 0 3px var(--input-focus-ring);
      }

      &.has-val {
        border-color: var(--input-focus-border);
      }
    }

    .otp-hidden-input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: text;
      font-size: 16px;
    }

    /* App Simulator Widget */
    .app-simulator-widget {
      width: 100%;
      background-color: var(--bg-canvas);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 0.625rem 0.75rem;
      margin-bottom: 1.5rem;
      box-shadow: var(--shadow-sm);
    }

    .sim-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.375rem;
      font-size: 0.6875rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .sim-brand {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .active-dot {
      width: 5px;
      height: 5px;
      background-color: #10b981;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }

    .copy-code-btn {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.625rem;
      transition: color 0.15s;

      &:hover {
        color: var(--text-primary);
      }
    }

    .copied-txt {
      color: #10b981;
      font-weight: 500;
    }

    .sim-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sim-code {
      font-size: 1.125rem;
      font-weight: 700;
      font-family: monospace;
      letter-spacing: 0.05em;
      color: var(--text-primary);
    }

    .sim-timer {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .sim-seconds {
      font-size: 0.6875rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .circle-svg {
      transform: rotate(-90deg);
    }

    .circle-bg {
      fill: none;
      stroke: var(--border-color);
      stroke-width: 2px;
    }

    .circle-fill {
      fill: none;
      stroke: var(--text-primary);
      stroke-width: 2px;
      stroke-linecap: round;
      stroke-dasharray: 50.24; /* 2 * PI * r (r=8) */
      transition: stroke-dashoffset 1s linear;
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
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
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
  isCopied = signal<boolean>(false);

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
      this.otp = ''; // Clear wrong OTP
      this.errorMessage.set('Invalid Google Authenticator code. Please try again.');
    }
  }

  onCancelMfa() {
    this.step.set('credentials');
    this.errorMessage.set('');
  }

  // Format OTP as "123 456" for readability in simulator
  formatCode(code: string): string {
    if (code.length === 6) {
      return `${code.slice(0, 3)} ${code.slice(3)}`;
    }
    return code;
  }

  // Calculate SVG stroke offset based on timer (30s)
  getStrokeOffset(): number {
    const time = this.authService.otpTimeRemaining();
    const circumference = 50.24; // 2 * PI * r (r=8)
    return circumference - (time / 30) * circumference;
  }

  // Copy code to clipboard simulator helper
  copyCode() {
    const code = this.authService.activeOtp();
    if (code && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(code).then(() => {
        this.isCopied.set(true);
        setTimeout(() => this.isCopied.set(false), 2000);
      });
    }
  }
}

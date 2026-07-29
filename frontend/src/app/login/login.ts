import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(10px)',
      })),
      transition('void <=> *', animate('300ms ease-in-out')),
    ])
  ]
})
export class LoginComponent implements OnInit { 
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';
  private platformId = inject(PLATFORM_ID);

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private auth: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn) {
      this.router.navigate(['/dash']);
      return;
    }
    this.setupInputAnimations();
  }

  get username(): string {
    return this.loginForm.get('username')?.value || '';
  }

  get password(): string {
    return this.loginForm.get('password')?.value || '';
  }

  setupInputAnimations(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        const container = input.closest('.input-container');
        if (container) {
          container.classList.add('input-focused');
        }
      });
      input.addEventListener('blur', () => {
        const container = input.closest('.input-container');
        if (container && (input as HTMLInputElement).value === '') {
          container.classList.remove('input-focused');
        }
      });
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.api.login(this.username, this.password).subscribe({
      next: (res) => {
        this.auth.saveSession(res.token, res.user.username);
        this.router.navigate(['/dash']);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Identifiant ou mot de passe incorrect';
        this.loginForm.get('password')?.reset();
        this.isLoading = false;
      },
    });
  }

  goToHome(): void {
    this.router.navigate(['/visit-form']);
  }
}

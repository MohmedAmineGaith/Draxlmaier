import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  private readonly ADMIN_USERNAME = 'admin';
  private readonly ADMIN_PASSWORD = 'admin123456';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.setupInputAnimations();
  }

  get username(): string {
    return this.loginForm.get('username')?.value || '';
  }

  get password(): string {
    return this.loginForm.get('password')?.value || '';
  }

  setupInputAnimations(): void {
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

    setTimeout(() => {
      if (this.username === this.ADMIN_USERNAME && this.password === this.ADMIN_PASSWORD) {
        console.log('✅ Connexion réussie → navigation');
        this.router.navigate(['/dash']);
      } else {
        this.errorMessage = 'Identifiant ou mot de passe incorrect';
        this.loginForm.get('password')?.reset();
      }
      this.isLoading = false;
    }, 1000);
  }
  goToHome(): void {
    this.router.navigate(['/visit-form']);
  }
}

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-visit-form',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './visit-form.html',
  styleUrls: ['./visit-form.css']
})
export class VisitFormComponent implements AfterViewInit, OnDestroy {
  submitted = false;
  sent = false;
  sending = false;
  submitError = '';
  form: FormGroup;
  private adminClickListener?: (event: Event) => void;

  typeOptions = ['RH', 'Client', 'Fournisseur', 'Prestataire', 'Autre'];
  motifOptions = ['Réunion', 'Entretien', 'Audit', 'Formation', 'Livraison'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private elementRef: ElementRef<HTMLElement>
  ) {
    this.form = this.fb.group({
      nom:          ['', [Validators.required, Validators.maxLength(1000)]],
      societe:      ['', [Validators.required, Validators.maxLength(1000)]],
      email:        ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      tel:          ['', [Validators.required, Validators.pattern(/^[+\d\s\-().]{6,}$/)]],
      localisation: ['', [Validators.required, Validators.maxLength(1000)]],
      date:         ['', [Validators.required]],
      type:         ['RH', [Validators.required]],
      motif:        ['Réunion', [Validators.required]],
      responsable:  ['', [Validators.required, Validators.maxLength(1000)]],
      but:          ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  ngAfterViewInit(): void {
    const switchEl = this.elementRef.nativeElement.querySelector('.switch');
    if (!switchEl) return;

    this.adminClickListener = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      this.goToLogin();
    };

    switchEl.addEventListener('click', this.adminClickListener);
  }

  ngOnDestroy(): void {
    const switchEl = this.elementRef.nativeElement.querySelector('.switch');
    if (switchEl && this.adminClickListener) {
      switchEl.removeEventListener('click', this.adminClickListener);
    }
  }

  private clean(v: unknown): string {
    return String(v ?? '').trim().slice(0, 1000);
  }

  hasError(ctrl: string, err?: string): boolean {
    const c = this.form.get(ctrl);
    if (!c) return false;
    if (!this.submitted && !c.touched) return false;
    return err ? c.hasError(err) : c.invalid;
  }

  goToLogin(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);
  }

  onSubmit(): void {
    this.submitted = true;
    this.submitError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;
    const data = {
      nom:          this.clean(raw.nom),
      societe:      this.clean(raw.societe),
      email:        this.clean(raw.email),
      tel:          this.clean(raw.tel),
      localisation: this.clean(raw.localisation),
      date:         this.clean(raw.date),
      type:         this.clean(raw.type),
      motif:        this.clean(raw.motif),
      responsable:  this.clean(raw.responsable),
      but:          this.clean(raw.but),
    };

    this.sending = true;
    this.api.submitVisitForm(data).subscribe({
      next: () => {
        this.sent = true;
        this.sending = false;
        setTimeout(() => {
          this.form.reset({ type: 'RH', motif: 'Réunion' });
          this.submitted = false;
          this.sent = false;
        }, 2200);
      },
      error: () => {
        this.sending = false;
        this.submitError = 'Impossible d\'envoyer la demande. Vérifiez que le serveur est démarré.';
      },
    });
  }
}

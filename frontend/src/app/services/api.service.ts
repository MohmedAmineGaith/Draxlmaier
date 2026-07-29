import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DashboardStats,
  LoginResponse,
  Participant,
  VisitFormPayload,
} from '../models/api.models';
import { apiUrl } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(apiUrl('/auth/login'), { username, password });
  }

  submitVisitForm(data: VisitFormPayload): Observable<Participant> {
    return this.http.post<Participant>(apiUrl('/formulaires'), data);
  }

  getFormulaires(): Observable<Participant[]> {
    return this.http.get<Participant[]>(apiUrl('/formulaires'));
  }

  updateFormulaireStatut(id: string, statut: string): Observable<Participant> {
    return this.http.patch<Participant>(apiUrl(`/formulaires/${id}`), { statut });
  }

  deleteFormulaire(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(apiUrl(`/formulaires/${id}`));
  }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(apiUrl('/stats'));
  }
}

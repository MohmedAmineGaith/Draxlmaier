export interface Participant {
  id: string;
  prenom: string;
  nom: string;
  ordre: number;
  Organisation: string;
  motif: string;
  email: string;
  telephone: string;
  type: string;
  derige: string;
  participation: string;
  localisation?: string;
  dateVisite?: string;
  but?: string;
  submittedAt?: string;
}

export interface VisitFormPayload {
  nom: string;
  societe: string;
  email: string;
  tel: string;
  localisation: string;
  date: string;
  type: string;
  motif: string;
  responsable: string;
  but: string;
}

export interface DashboardStats {
  totalVisites: number;
  totalAccompagnants: number;
  totalResponsables: number;
  totalCommentaires: number;
  totalVisiteurs: number;
  totalParticipants: number;
  enPresence: number;
  enLigne: number;
  enAttente: number;
}

export interface LoginResponse {
  token: string;
  user: { username: string };
}

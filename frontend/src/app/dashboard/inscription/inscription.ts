import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Navbar } from '../navbar/navbar';

export type ColumnKey =
  | 'prenom'
  | 'nom'
  | 'ordre'
  | 'Organisation'
  | 'motif'
  | 'email'
  | 'telephone'
  |  'type'
  | 'derige'
  | 'participation';

interface Participant {
  id: number;
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
}

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [RouterModule,CommonModule, FormsModule,Navbar],
  templateUrl: './inscription.html',
  styleUrls: ['./inscription.css']
})
export class Inscription implements AfterViewInit, OnInit {
  @ViewChild('participantTable', { static: false }) table!: ElementRef;

  ngOnInit(): void {
  this.loadTestParticipants();
}
  searchTerm = '';
  selectedParticipants: Set<number> = new Set();
  showColumnVisibility = false;

  visibleColumns: Record<ColumnKey, boolean> = {
    ordre: true,
    prenom: true,
    nom: true,
    Organisation: true,
    motif: true,
    email: true,
    telephone: true,
    type: true,
    derige: true,
    participation: true
  };

  participants: Participant[] = [];

  dataTableInitialized: boolean = false;

  pendingTypeChange: { id: number, participation: string } | null = null;

  ngAfterViewInit(): void {
    // Supprimé temporairement jusqu'à ce que DataTables soit configuré
  }
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  loadTestParticipants(): void {
    this.participants = [
      {
        id: 1,
        prenom: 'Mohamed',
        nom: 'Guith',
        ordre: 1,
        Organisation: 'DRÄXLMAIER',
        motif: 'Réunion',
        email: 'mohamed@example.com',
        telephone: '+216 20 123 456',
        type: 'Client',
        derige: 'Commercial',
        participation: 'EN_PRESENCE'
      },
      {
        id: 2,
        prenom: 'Sarra',
        nom: 'Ben Ali',
        ordre: 2,
        Organisation: 'ABC Tunisie',
        motif: 'Entretien',
        email: 'sarra@example.com',
        telephone: '+216 21 234 567',
        type: 'Fournisseur',
        derige: 'Ressources Humaines',
        participation: 'EN_LIGNE'
      },
      {
        id: 3,
        prenom: 'Ahmed',
        nom: 'Trabelsi',
        ordre: 3,
        Organisation: 'SOTUVER',
        motif: 'Audit',
        email: 'ahmed@example.com',
        telephone: '+216 22 345 678',
        type: 'Prestataire',
        derige: 'Direction',
        participation: 'EN_ATTENTE'
      },
      {
        id: 4,
        prenom: 'Amira',
        nom: 'Khelifi',
        ordre: 4,
        Organisation: 'Orange Tunisie',
        motif: 'Formation',
        email: 'amira@example.com',
        telephone: '+216 23 456 789',
        type: 'Client',
        derige: 'RH',
        participation: 'EN_PRESENCE'
      },
    ];
    }

  filteredInscription(): Participant[] {
    if (!this.searchTerm) return this.participants;
    const term = this.searchTerm.toLowerCase();
    return this.participants.filter(p =>
      Object.values(p).some(val =>
        val?.toString().toLowerCase().includes(term)
      )
    );
  }

  get totalParticipants(): number {
    return this.participants.length;
  }

  get participantsEnPresence(): number {
    return this.participants.filter(p => p.participation === 'EN_PRÉSENCE').length;
  }

  get participantsEnLigne(): number {
    return this.participants.filter(p => p.participation === 'EN_LIGNE').length;
  }

  // Actions
  copyData() {
    console.log('Copier les données');
  }

  printTable() {
    console.log('Imprimer le tableau');
  }

  toggleColumnVisibility() {
    this.showColumnVisibility = !this.showColumnVisibility;
  }

  selectAll() {
    this.participants.forEach((_, index) => this.selectedParticipants.add(index));
  }

  deselectAll() {
    this.selectedParticipants.clear();
  }

  

  toggleParticipantSelection(index: number) {
    if (this.selectedParticipants.has(index)) {
      this.selectedParticipants.delete(index);
    } else {
      this.selectedParticipants.add(index);
    }
  }

  isSelected(index: number): boolean {
    return this.selectedParticipants.has(index);
  }

  getParticipationBadgeClass(participation: string): string {
    switch (participation) {
      case 'EN_PRESENCE':
        return 'badge-presence';
      case 'EN_LIGNE':
        return 'badge-online';
      case 'EN_ATTENTE':
        return 'badge-pending';
      default:
        return 'badge-pending';
    }
  }

  formatParticipationStatus(participation: string): string {
    switch (participation) {
      case 'EN_PRESENCE':
        return 'En présence';
      case 'EN_LIGNE':
        return 'En ligne';
      case 'EN_ATTENTE':
        return 'En attente';
      default:
        return 'En attente';
    }
  }

  getMailtoLink(email: string): string {
    return `mailto:${email}`;
  }

  getVisibleColumn(column: string): boolean {
    return this.visibleColumns[column as keyof typeof this.visibleColumns];
  }

  get columnKeys(): ColumnKey[] {
    return Object.keys(this.visibleColumns) as ColumnKey[];
  }

  deleteFormulaire(formulaire: Participant) {
    const id = formulaire.id; // Assure-toi que l'id est bien présent
    if (confirm('Voulez-vous vraiment supprimer ce formulaire ?')) {
      this.http.delete(`http://localhost:8080/api/formulaires/${id}`).subscribe({
        next: () => {
          this.participants = this.participants.filter(p => p.id !== id);
        },
        error: () => alert('Erreur lors de la suppression')
      });
    }
  }

  selectParticipationType(participant: Participant, type: string) {
    this.pendingTypeChange = { id: participant.id, participation: type };
    participant.participation = type;
  }

  confirmTypeChange(fieldsToUpdate: any = null) {
    if (!this.pendingTypeChange) return;
    const { id, participation } = this.pendingTypeChange;
    // Si des champs spécifiques sont fournis, on les utilise, sinon on ne modifie que le statut
    const patchData = fieldsToUpdate || { statut: participation };
    this.http.patch(`http://localhost:8080/api/formulaires/${id}`, patchData).subscribe({
      next: () => {
        const participant = this.participants.find(p => p.id === id);
        if (participant && patchData.statut) {
          participant.participation = patchData.statut;
        }
        this.pendingTypeChange = null;
      },
      error: () => alert('Erreur lors de la mise à jour')
    });
  }
}
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { Navbar } from '../navbar/navbar';

import { ApiService } from '../../services/api.service';

import { Participant } from '../../models/api.models';



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



@Component({

  selector: 'app-inscription',

  standalone: true,

  imports: [RouterModule, CommonModule, FormsModule, Navbar],

  templateUrl: './inscription.html',

  styleUrls: ['./inscription.css']

})

export class Inscription implements AfterViewInit, OnInit {

  @ViewChild('participantTable', { static: false }) table!: ElementRef;



  searchTerm = '';

  selectedParticipants: Set<string> = new Set();

  showColumnVisibility = false;

  loading = true;

  loadError = '';



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

  dataTableInitialized = false;

  pendingTypeChange: { id: string; participation: string } | null = null;



  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}



  ngOnInit(): void {

    this.loadParticipants();

  }



  ngAfterViewInit(): void {}



  loadParticipants(): void {

    this.loading = true;

    this.loadError = '';

    this.api.getFormulaires().subscribe({

      next: (data) => {

        this.participants = data;

        this.loading = false;

        this.cdr.detectChanges();

      },

      error: () => {

        this.loading = false;

        this.loadError = 'Impossible de charger les inscriptions.';

      },

    });

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

    return this.participants.filter(p => p.participation === 'EN_PRESENCE').length;

  }



  get participantsEnLigne(): number {

    return this.participants.filter(p => p.participation === 'EN_LIGNE').length;

  }



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

    this.participants.forEach((p) => this.selectedParticipants.add(p.id));

  }



  deselectAll() {

    this.selectedParticipants.clear();

  }



  toggleParticipantSelection(id: string) {

    if (this.selectedParticipants.has(id)) {

      this.selectedParticipants.delete(id);

    } else {

      this.selectedParticipants.add(id);

    }

  }



  isSelected(id: string): boolean {

    return this.selectedParticipants.has(id);

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

    const id = formulaire.id;

    if (confirm('Voulez-vous vraiment supprimer ce formulaire ?')) {

      this.api.deleteFormulaire(id).subscribe({

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



  confirmTypeChange(fieldsToUpdate: { statut?: string } | null = null) {

    if (!this.pendingTypeChange) return;

    const { id, participation } = this.pendingTypeChange;

    const statut = fieldsToUpdate?.statut || participation;

    this.api.updateFormulaireStatut(id, statut).subscribe({

      next: (updated) => {

        const participant = this.participants.find(p => p.id === id);

        if (participant) {

          participant.participation = updated.participation;

        }

        this.pendingTypeChange = null;

      },

      error: () => alert('Erreur lors de la mise à jour')

    });

  }

}


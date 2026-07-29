import { Component, OnInit } from '@angular/core';

import { Router, RouterModule } from '@angular/router';

import { NgClass, NgFor, NgIf } from '@angular/common';

import { Navbar } from '../navbar/navbar';

import { ApiService } from '../../services/api.service';

import { DashboardStats } from '../../models/api.models';



@Component({

  selector: 'app-dashboard',

  imports: [RouterModule, NgFor, NgIf, Navbar],

  templateUrl: './dashboard.html',

  styleUrl: './dashboard.css',

})

export class Dashboard implements OnInit {

  cards: Array<{ value: number; label: string; linkLabel: string; link?: string; icon: string; color: string }> = [];

  loading = true;



  showSelectMenu = false;

  showNavbar = false;



  constructor(private router: Router, private api: ApiService) {}



  ngOnInit(): void {

    this.api.getStats().subscribe({

      next: (stats) => this.buildCards(stats),

      error: () => this.buildCards({

        totalVisites: 0,

        totalAccompagnants: 0,

        totalResponsables: 0,

        totalCommentaires: 0,

        totalVisiteurs: 0,

        totalParticipants: 0,

        enPresence: 0,

        enLigne: 0,

        enAttente: 0,

      }),

    });

  }



  private buildCards(stats: DashboardStats): void {

    this.cards = [

      { value: stats.totalVisites, label: 'Total des visites', linkLabel: 'Liste des visiteurs', link: '/inscriptions', icon: 'fa fa-user', color: '#6f42c1' },

      { value: stats.totalAccompagnants, label: 'En présence', linkLabel: 'Visites de projets le 7 juin', link: '/accompagnants', icon: 'fa fa-users', color: '#6c757d' },

      { value: stats.totalResponsables, label: 'Total des responsables', linkLabel: 'Totaux', link: '/nuits', icon: 'sigma', color: '#009688' },

      { value: stats.enAttente, label: 'En attente', linkLabel: 'Liste des commentaires', link: '/commentaires', icon: 'fa fa-comments', color: '#212529' },

      { value: stats.enLigne, label: 'En ligne', linkLabel: 'Réception dîner CEB du 6 juin', link: '/diner-3-avril', icon: 'fa fa-coffee', color: '#03a9f4' },

      { value: stats.totalParticipants, label: 'Total participants', linkLabel: 'Visites de projets le 7 juin', link: '/visites', icon: 'fa fa-building', color: '#f44336' },

      { value: stats.totalVisiteurs, label: 'Visiteurs en attente', linkLabel: 'Gérer le contenu', link: '/contenu', icon: 'fa fa-file-text', color: '#4caf50' }

    ];

    this.loading = false;

  }



  onToggleNavbar() {

    this.showNavbar = !this.showNavbar;

  }



  onSelectChange(event: Event) {

    const selectElement = event.target as HTMLSelectElement;

    const value = selectElement.value;

    if (value) {

      this.router.navigate([value]);

    }

  }

}


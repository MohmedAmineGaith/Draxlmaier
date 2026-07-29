import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StatCard {
  key: string;
  label: string;
  value: number;
  delta: string;
  trend: 'up' | 'down';
  icon: string;
  accent: 'teal' | 'navy' | 'red' | 'gold' | 'violet';
}

interface Activity {
  who: string;
  action: string;
  target: string;
  time: string;
  type: 'visite' | 'commentaire' | 'gestion' | 'responsable';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  today = new Date();

  stats: StatCard[] = [
    { key: 'visites', label: 'Total des visites', value: 1284, delta: '+12,4%', trend: 'up', icon: 'users', accent: 'teal' },
    { key: 'accompagnement', label: 'Total accompagnement', value: 342, delta: '+4,1%', trend: 'up', icon: 'route', accent: 'navy' },
    { key: 'responsables', label: 'Total des responsables', value: 58, delta: '+2', trend: 'up', icon: 'badge', accent: 'gold' },
    { key: 'commentaires', label: 'Total des commentaires', value: 476, delta: '-1,8%', trend: 'down', icon: 'chat', accent: 'red' },
    { key: 'gestion', label: 'Visites — gestion du contenu', value: 219, delta: '+7,6%', trend: 'up', icon: 'grid', accent: 'violet' },
  ];

  // Mini bar chart (visites par mois)
  chart = [
    { m: 'Jan', v: 62 }, { m: 'Fév', v: 78 }, { m: 'Mar', v: 91 },
    { m: 'Avr', v: 74 }, { m: 'Mai', v: 110 }, { m: 'Jui', v: 128 },
    { m: 'Jul', v: 142 }, { m: 'Aoû', v: 118 }, { m: 'Sep', v: 156 },
    { m: 'Oct', v: 171 }, { m: 'Nov', v: 148 }, { m: 'Déc', v: 186 },
  ];
  chartMax = Math.max(...this.chart.map(c => c.v));

  activities: Activity[] = [
    { who: 'Sami B.',   action: 'a enregistré une visite pour', target: 'Bosch Tunisie',        time: 'il y a 5 min',  type: 'visite' },
    { who: 'Yasmine K.', action: 'a commenté',                  target: 'Rapport Q3',           time: 'il y a 22 min', type: 'commentaire' },
    { who: 'Admin',      action: 'a ajouté un responsable',     target: 'Karim Trabelsi',       time: 'il y a 1 h',    type: 'responsable' },
    { who: 'Mehdi Z.',   action: 'a mis à jour un contenu',     target: 'Procédure d’accueil',  time: 'il y a 2 h',    type: 'gestion' },
    { who: 'Amel R.',    action: 'a clôturé une visite',        target: 'Delegation VW',        time: 'il y a 3 h',    type: 'visite' },
  ];

  formatNumber(n: number): string {
    return n.toLocaleString('fr-FR');
  }
}

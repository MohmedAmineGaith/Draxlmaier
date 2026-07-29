import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true, 
  imports: [RouterModule,NgClass, NgIf  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'] 
})
export class Navbar {
  showSelectMenu: boolean = false;
  showNavbar: boolean = false;

  constructor(private router: Router) {}

  onToggleNavbar() {
    this.showNavbar = !this.showNavbar;
  }

  goToInscri(): void {
    console.log('Navigation vers inscriptions');
    this.router.navigate(['/inscriptions']);
  }
  goToSommaire(): void{
    this.router.navigate(['/dash']);
  }

  onSelectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    if (value) {
      this.router.navigate([value]);
    }
  }
}

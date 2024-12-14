import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'NatureNew';
  showNav: boolean = true;
  excludedRoutes: string[] = ['/login', '/signup','/admin-panel','/admin-product','/admin-remedies','/admin-management','/admin-health-tips','/admin-user-management', '/successpay']; // Add paths where you don't want nav

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is in the excluded list
        this.showNav = !this.excludedRoutes.includes(event.urlAfterRedirects);
      }
    });
  }
}

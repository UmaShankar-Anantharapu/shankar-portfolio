import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentTheme$: Observable<string>;
  currentTheme: string = 'dark';
  private themeSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private themeService: ThemeService
  ) {
    this.currentTheme$ = this.themeService.currentTheme$;
  }

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeSubscription = this.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
      console.log('Navbar theme changed to:', theme);

      // Force update of CSS custom properties
      this.updateThemeProperties(theme);
    });
  }

  private updateThemeProperties(theme: string): void {
    // Ensure theme properties are applied immediately
    const root = document.documentElement;
    if (theme === 'light') {
      root.style.setProperty('--navbar-background', 'rgba(245, 245, 245, 0.95)');
      root.style.setProperty('--navbar-text-color', '#333333');
    } else {
      root.style.setProperty('--navbar-background', 'rgba(26, 26, 26, 0.95)');
      root.style.setProperty('--navbar-text-color', '#ffffff');
    }
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  toggleTheme(): void {
    console.log('Theme toggle clicked, current theme:', this.currentTheme);
    this.themeService.toggleTheme();

    // Add visual feedback for theme toggle
    const button = document.querySelector('.theme-toggle-btn') as HTMLElement;
    if (button) {
      button.style.transform = 'scale(0.9)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 150);
    }
  }

  scrollToContact(): void {
    // Performance optimized scroll to contact section
    this.router.navigate(['/contact']).then(() => {
      // Smooth scroll to contact section
      const contactElement = document.getElementById('contact');
      if (contactElement) {
        contactElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }
}

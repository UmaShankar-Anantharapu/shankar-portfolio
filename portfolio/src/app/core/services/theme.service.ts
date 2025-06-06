import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Theme {
  name: string;
  properties: {
    [key: string]: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<string>('dark');
  public currentTheme$ = this.currentThemeSubject.asObservable();

  private themes: { [key: string]: Theme } = {
    dark: {
      name: 'dark',
      properties: {
        '--primary-color': '#1A1A1A',
        '--primary-color-dark': '#2C3E50',
        '--secondary-color': '#26A69A',
        '--text-color': '#ffffff',
        '--text-color-secondary': '#e0e0e0',
        '--background-gradient': 'linear-gradient(135deg, #1A1A1A 0%, #2C3E50 100%)',
        '--navbar-background': 'rgba(26, 26, 26, 0.95)',
        '--navbar-text-color': '#ffffff',
        '--button-text-color': '#ffffff'
      }
    },
    light: {
      name: 'light',
      properties: {
        '--primary-color': '#f5f5f5',
        '--primary-color-dark': '#e0e0e0',
        '--secondary-color': '#26A69A',
        '--text-color': '#333333',
        '--text-color-secondary': '#666666',
        '--background-gradient': 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
        '--navbar-background': 'rgba(245, 245, 245, 0.95)',
        '--navbar-text-color': '#333333',
        '--button-text-color': '#ffffff'
      }
    }
  };

  constructor() {
    // Initialize with dark theme
    this.setTheme('dark');
  }

  setTheme(themeName: string): void {
    const theme = this.themes[themeName];
    if (theme) {
      this.currentThemeSubject.next(themeName);
      this.applyTheme(theme);
    }
  }

  getCurrentTheme(): string {
    return this.currentThemeSubject.value;
  }

  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    Object.keys(theme.properties).forEach(property => {
      root.style.setProperty(property, theme.properties[property]);
    });
  }
}

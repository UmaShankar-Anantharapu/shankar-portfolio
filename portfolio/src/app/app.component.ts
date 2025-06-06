import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { PreloaderComponent } from './shared/components/preloader/preloader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, PreloaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'portfolio';
  showPreloader = true;

  ngOnInit(): void {
    // Listen for preloader hidden event
    document.addEventListener('preloaderHidden', () => {
      this.showPreloader = false;
    });
  }
}

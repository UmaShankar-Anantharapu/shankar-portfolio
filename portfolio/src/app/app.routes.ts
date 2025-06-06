import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    data: { preload: true },
    title: 'Uma Shankar - Software Engineer'
  },
  {
    path: 'about',
    loadChildren: () => import('./features/about/about.module').then(m => m.AboutModule),
    data: { preload: true },
    title: 'About - Uma Shankar'
  },
  {
    path: 'projects',
    loadChildren: () => import('./features/projects/projects.module').then(m => m.ProjectsModule),
    data: { preload: true },
    title: 'Projects - Uma Shankar'
  },
  {
    path: 'skills',
    loadChildren: () => import('./features/skills/skills.module').then(m => m.SkillsModule),
    data: { preload: true },
    title: 'Skills - Uma Shankar'
  },
  {
    path: 'contact',
    loadChildren: () => import('./features/contact/contact.module').then(m => m.ContactModule),
    data: { preload: false },
    title: 'Contact - Uma Shankar'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

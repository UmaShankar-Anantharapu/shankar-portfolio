import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
    data: { preload: true, priority: 'high' },
    title: 'Uma Shankar - Software Engineer'
  },
  {
    path: 'about',
    loadChildren: () => import('./features/about/about.module').then(m => m.AboutModule),
    data: { preload: true, priority: 'high' },
    title: 'About - Uma Shankar'
  },
  {
    path: 'projects',
    loadChildren: () => import('./features/projects/projects.module').then(m => m.ProjectsModule),
    data: { preload: true, priority: 'high' },
    title: 'Projects - Uma Shankar'
  },
  {
    path: 'skills',
    loadChildren: () => import('./features/skills/skills.module').then(m => m.SkillsModule),
    data: { preload: true, priority: 'high' },
    title: 'Skills - Uma Shankar'
  },
  {
    path: 'contact',
    loadChildren: () => import('./features/contact/contact.module').then(m => m.ContactModule),
    data: { preload: false, priority: 'low' },
    title: 'Contact - Uma Shankar'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // Performance optimizations
    preloadingStrategy: PreloadAllModules,
    enableTracing: false, // Set to true only for debugging
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 80], // Offset for fixed navbar

    // Router performance optimizations
    onSameUrlNavigation: 'reload',
    malformedUriErrorHandler: (error, urlSerializer, url) => {
      console.error('Malformed URI error:', error);
      return urlSerializer.parse('/');
    },

    // Enable router data and resolve guards optimization
    paramsInheritanceStrategy: 'emptyOnly',

    // Accessibility improvements
    relativeLinkResolution: 'legacy',

    // Performance optimizations for large apps
    urlUpdateStrategy: 'deferred',
    canceledNavigationResolution: 'replace'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { ProjectCardComponent } from './project-card.component';
import { CelesteKpiModalComponent } from './celeste-kpi-modal.component';
import { IcoSphereModalComponent } from './ico-sphere-modal.component';

// Angular Material imports
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectCardComponent,
    CelesteKpiModalComponent,
    IcoSphereModalComponent
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ProjectsModule { }

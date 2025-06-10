import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { ProjectCardComponent } from './project-card.component';
import { CelesteKpiModalComponent } from './celeste-kpi-modal.component';
import { IcoSphereModalComponent } from './ico-sphere-modal.component';
import { ProjectDetailModalComponent } from './project-detail-modal.component';

// Angular Material imports
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectCardComponent,
    CelesteKpiModalComponent,
    IcoSphereModalComponent,
    ProjectDetailModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProjectsRoutingModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ]
})
export class ProjectsModule { }

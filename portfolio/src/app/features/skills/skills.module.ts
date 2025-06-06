import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillsRoutingModule } from './skills-routing.module';
import { SkillsComponent } from './skills.component';

// Performance-optimized components
import { SkillItemComponent } from './components/skill-item.component';

// Modal Components
import { GenericSkillModalComponent } from './modals/generic-skill-modal.component';
import { HighchartsDemoModalComponent } from './modals/highcharts-demo-modal.component';
import { ThreeJSDemoModalComponent } from './modals/threejs-demo-modal.component';
import { AGGridDemoModalComponent } from './modals/ag-grid-demo-modal.component';
import { CanvasDemoModalComponent } from './modals/canvas-demo-modal.component';
import { GridsterDemoModalComponent } from './modals/gridster-demo-modal.component';
import { MicroFrontendDemoModalComponent } from './modals/micro-frontend-demo-modal.component';

// Angular Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    SkillsComponent,
    SkillItemComponent,
    GenericSkillModalComponent,
    HighchartsDemoModalComponent,
    ThreeJSDemoModalComponent,
    AGGridDemoModalComponent,
    CanvasDemoModalComponent,
    GridsterDemoModalComponent,
    MicroFrontendDemoModalComponent
  ],
  imports: [
    CommonModule,
    SkillsRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ]
})
export class SkillsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';

// Angular Material imports
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AboutComponent
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
    MatStepperModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class AboutModule { }

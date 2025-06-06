import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillsComponent } from './skills.component';

const routes: Routes = [
  {
    path: '',
    component: SkillsComponent,
    data: { 
      title: 'Skills - Uma Shankar',
      description: 'Technical skills and expertise in frontend and backend development'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsRoutingModule { }

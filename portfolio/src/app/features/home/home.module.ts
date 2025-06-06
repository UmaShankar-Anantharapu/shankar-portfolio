import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule
  ],
  providers: [
    // Lazy load services only when needed
  ]
})
export class HomeModule { }

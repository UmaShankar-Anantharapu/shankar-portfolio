import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact.component';

// Angular Material
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

// Lottie Player
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [
    ContactComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContactRoutingModule,
    MatSnackBarModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // For lottie-player custom element
})
export class ContactModule { }

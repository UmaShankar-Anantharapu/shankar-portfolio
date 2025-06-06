import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-micro-frontend-demo-modal',
  template: `
    <div class="micro-frontend-demo-modal">
      <div class="modal-header">
        <h2 class="skill-title">Micro Frontend Demo</h2>
        <button type="button" class="close-btn" (click)="closeModal()">✕</button>
      </div>
      <div class="modal-content">
        <p>Micro Frontend architecture demo coming soon...</p>
      </div>
    </div>
  `,
  styles: [`
    .micro-frontend-demo-modal {
      background: var(--primary-color);
      color: var(--text-color);
      border-radius: 16px;
      padding: 2rem;
      min-width: 400px;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .skill-title {
      font-family: 'Orbitron', sans-serif;
      color: var(--secondary-color);
      margin: 0;
    }
    .close-btn {
      background: none;
      border: none;
      color: var(--text-color);
      font-size: 1.5rem;
      cursor: pointer;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicroFrontendDemoModalComponent {
  constructor(private readonly dialogRef: MatDialogRef<MicroFrontendDemoModalComponent>) {}

  closeModal(): void {
    this.dialogRef.close();
  }
}

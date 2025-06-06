import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ag-grid-demo-modal',
  template: `
    <div class="ag-grid-demo-modal">
      <div class="modal-header">
        <h2 class="skill-title">AG-Grid Demo</h2>
        <button type="button" class="close-btn" (click)="closeModal()">✕</button>
      </div>
      <div class="modal-content">
        <p>AG-Grid demo coming soon...</p>
      </div>
    </div>
  `,
  styles: [`
    .ag-grid-demo-modal {
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
export class AGGridDemoModalComponent {
  constructor(private readonly dialogRef: MatDialogRef<AGGridDemoModalComponent>) {}

  closeModal(): void {
    this.dialogRef.close();
  }
}

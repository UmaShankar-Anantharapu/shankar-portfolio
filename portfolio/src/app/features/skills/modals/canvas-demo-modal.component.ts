import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-canvas-demo-modal',
  template: `
    <div class="canvas-demo-modal">
      <div class="modal-header">
        <h2 class="skill-title">{{ data.skillName }} Demo</h2>
        <button type="button" class="close-btn" (click)="closeModal()">✕</button>
      </div>
      <div class="modal-content">
        <p>{{ data.skillName }} demo coming soon...</p>
      </div>
    </div>
  `,
  styles: [`
    .canvas-demo-modal {
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
export class CanvasDemoModalComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<CanvasDemoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: { skillName: string }
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }
}

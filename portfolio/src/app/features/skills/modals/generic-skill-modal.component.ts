import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface GenericSkillData {
  skillName: string;
  description: string;
}

@Component({
  selector: 'app-generic-skill-modal',
  template: `
    <div class="generic-skill-modal">
      <div class="modal-header">
        <h2 class="skill-title">{{ data.skillName }}</h2>
        <button 
          type="button" 
          class="close-btn"
          (click)="closeModal()"
          aria-label="Close modal">
          ✕
        </button>
      </div>
      
      <div class="modal-content">
        <div class="skill-info">
          <p class="skill-description">{{ data.description }}</p>
          <div class="demo-placeholder">
            <div class="placeholder-icon">🚧</div>
            <h3>Demo Coming Soon</h3>
            <p>Interactive demo for {{ data.skillName }} is under development.</p>
            <p>This skill is actively used in production projects with proven expertise.</p>
          </div>
        </div>
      </div>
      
      <div class="modal-actions">
        <button type="button" class="action-btn primary" (click)="closeModal()">
          Got It
        </button>
      </div>
    </div>
  `,
  styles: [`
    .generic-skill-modal {
      background: var(--primary-color);
      color: var(--text-color);
      border-radius: 16px;
      overflow: hidden;
      min-width: 400px;
      max-width: 600px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid rgba(38, 166, 154, 0.2);
      background: rgba(255, 255, 255, 0.02);
    }

    .skill-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--secondary-color);
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      color: var(--text-color-secondary);
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--secondary-color);
    }

    .modal-content {
      padding: 2rem;
    }

    .skill-description {
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      line-height: 1.6;
      color: var(--text-color-secondary);
      margin-bottom: 2rem;
    }

    .demo-placeholder {
      text-align: center;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      border: 1px solid rgba(38, 166, 154, 0.1);
    }

    .placeholder-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .demo-placeholder h3 {
      font-family: 'Orbitron', sans-serif;
      color: var(--secondary-color);
      margin-bottom: 1rem;
    }

    .demo-placeholder p {
      font-family: 'Inter', sans-serif;
      color: var(--text-color-secondary);
      margin-bottom: 0.5rem;
    }

    .modal-actions {
      padding: 1rem 1.5rem;
      border-top: 1px solid rgba(38, 166, 154, 0.2);
      text-align: center;
    }

    .action-btn {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 8px;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-btn.primary {
      background: var(--secondary-color);
      color: white;
    }

    .action-btn.primary:hover {
      background: #1e8a7a;
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .generic-skill-modal {
        min-width: 300px;
        max-width: 90vw;
      }
      
      .modal-content {
        padding: 1.5rem;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericSkillModalComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<GenericSkillModalComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: GenericSkillData
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }
}

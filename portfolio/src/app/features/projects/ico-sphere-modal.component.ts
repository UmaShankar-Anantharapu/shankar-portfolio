import { 
  Component, 
  OnInit, 
  OnDestroy, 
  AfterViewInit, 
  ViewChild, 
  ElementRef, 
  ChangeDetectionStrategy,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { ThemeService } from '../../core/services/theme.service';
import { IcoSphereService, IcoSphereConfig } from '../../core/services/ico-sphere.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ico-sphere-modal',
  template: `
    <div class="ico-sphere-modal-container">
      <div class="sphere-card">
        <header class="sphere-header">
          <div class="sphere-avatar">
            <span class="sphere-icon">🌐</span>
          </div>
          <h2 class="sphere-title">ICO Sphere - 3D Visualization</h2>
          <p class="sphere-subtitle">Interactive 3D sphere with dynamic point cloud</p>
        </header>

        <div class="sphere-content">
          <!-- Large Three.js Preview -->
          <div class="sphere-preview-container">
            <div #sphereContainer class="sphere-preview-large"></div>
            <div class="sphere-controls">
              <button
                type="button"
                class="control-btn"
                (click)="toggleAnimation()"
                [attr.aria-label]="isAnimating ? 'Pause animation' : 'Play animation'">
                {{ isAnimating ? '⏸️' : '▶️' }}
              </button>
              <button
                type="button"
                class="control-btn"
                (click)="resetView()"
                aria-label="Reset view">
                🔄
              </button>
              <button
                type="button"
                class="control-btn"
                (click)="toggleWireframe()"
                [attr.aria-label]="showWireframe ? 'Hide wireframe' : 'Show wireframe'">
                {{ showWireframe ? '👁️‍🗨️' : '👁️' }}
              </button>
            </div>
          </div>

          <!-- Project Information -->
          <div class="project-info">
            <h4 class="info-title">Project Details</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Technology:</span>
                <span class="info-value">Three.js + WebGL</span>
              </div>
              <div class="info-item">
                <span class="info-label">Framework:</span>
                <span class="info-value">Angular 14</span>
              </div>
              <div class="info-item">
                <span class="info-label">Features:</span>
                <span class="info-value">Real-time 3D Rendering</span>
              </div>
              <div class="info-item">
                <span class="info-label">Performance:</span>
                <span class="info-value">60 FPS Optimized</span>
              </div>
            </div>

            <div class="tech-highlights">
              <h5 class="highlights-title">Technical Highlights</h5>
              <ul class="highlights-list">
                <li>Interactive 3D sphere with icosahedral geometry</li>
                <li>Dynamic point cloud system with 200+ particles</li>
                <li>Hardware-accelerated WebGL rendering</li>
                <li>Responsive design with theme integration</li>
                <li>Performance-optimized for mobile devices</li>
                <li>Real-time lighting and material effects</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="sphere-actions">
          <button type="button" class="action-btn primary" (click)="viewLiveDemo()">
            🚀 View Live Demo
          </button>
          <button type="button" class="action-btn secondary" (click)="viewSourceCode()">
            💻 View Source
          </button>
          <button type="button" class="action-btn" (click)="closeModal()">
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ico-sphere-modal-container {
      padding: 0;
      margin: 0;
      max-width: 600px;
      width: 100%;
      height: auto;
      max-height: 80vh;
      overflow-y: auto;
    }

    .sphere-card {
      background: var(--primary-color);
      color: var(--text-color);
      border: 1px solid rgba(38, 166, 154, 0.2);
      border-radius: 16px;
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(38, 166, 154, 0.1);
      overflow: hidden;
    }

    .sphere-header {
      border-bottom: 1px solid rgba(38, 166, 154, 0.2);
      padding: 0.5rem 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .sphere-avatar {
      background: var(--secondary-color);
      color: white;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .sphere-icon {
      font-size: 1.5rem;
      animation: rotate3d 3s linear infinite;
    }

    .sphere-title {
      font-family: 'Orbitron', sans-serif;
      color: var(--secondary-color);
      font-size: 1.5rem;
      font-weight: 600;
    }

    .sphere-subtitle {
      color: var(--text-color-secondary);
      font-family: 'Inter', sans-serif;
    }

    .sphere-content {
      padding: 0.5rem 0.75rem;
    }

    .sphere-preview-container {
      position: relative;
      margin-bottom: 0.5rem;
      border-radius: 8px;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(38, 166, 154, 0.2);
    }

    .sphere-preview-large {
      width: 100%;
      height: 250px;
      position: relative;
    }

    .sphere-controls {
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: flex;
      gap: 0.5rem;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 8px;
      padding: 0.5rem;
      backdrop-filter: blur(10px);
    }

    .control-btn {
      color: white;
      background: rgba(38, 166, 154, 0.2);
      border: 1px solid rgba(38, 166, 154, 0.3);
      border-radius: 6px;
      padding: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .control-btn:hover {
      background: rgba(38, 166, 154, 0.4);
      transform: scale(1.1);
    }

    .project-info {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
      padding: 0.5rem;
      border: 1px solid rgba(38, 166, 154, 0.1);
    }

    .info-title {
      font-family: 'Orbitron', sans-serif;
      color: var(--secondary-color);
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      background: rgba(38, 166, 154, 0.05);
      border-radius: 6px;
      border: 1px solid rgba(38, 166, 154, 0.1);
    }

    .info-label {
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      color: var(--text-color-secondary);
    }

    .info-value {
      font-family: 'Orbitron', sans-serif;
      font-weight: 600;
      color: var(--secondary-color);
    }

    .tech-highlights {
      margin-top: 0.5rem;
    }

    .highlights-title {
      font-family: 'Inter', sans-serif;
      color: var(--text-color);
      margin-bottom: 1rem;
      font-size: 1rem;
    }

    .highlights-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .highlights-list li {
      font-family: 'Inter', sans-serif;
      color: var(--text-color-secondary);
      margin-bottom: 0.5rem;
      padding-left: 1.5rem;
      position: relative;
    }

    .highlights-list li::before {
      content: '▸';
      position: absolute;
      left: 0;
      color: var(--secondary-color);
      font-weight: bold;
    }

    .sphere-actions {
      padding: 0.5rem 0.75rem;
      border-top: 1px solid rgba(38, 166, 154, 0.2);
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .action-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-color);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .action-btn.primary {
      background: var(--secondary-color);
      color: white;
      border-color: var(--secondary-color);
    }

    .action-btn.secondary {
      background: rgba(38, 166, 154, 0.2);
      color: var(--secondary-color);
      border-color: var(--secondary-color);
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .action-btn.primary:hover {
      background: #1e8a7a;
    }

    .action-btn.secondary:hover {
      background: rgba(38, 166, 154, 0.3);
    }

    @keyframes rotate3d {
      from {
        transform: rotateY(0deg);
      }
      to {
        transform: rotateY(360deg);
      }
    }

    @media (max-width: 768px) {
      .ico-sphere-modal-container {
        max-width: 95vw;
        max-height: 90vh;
      }

      .sphere-preview-large {
        height: 250px;
      }

      .info-grid {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .sphere-actions {
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.5rem;
      }

      .sphere-header {
        padding: 0.75rem;
      }

      .sphere-content {
        padding: 0.75rem;
      }

      .project-info {
        padding: 0.75rem;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IcoSphereModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sphereContainer', { static: false }) sphereContainer!: ElementRef;
  
  currentTheme$!: Observable<string>;
  isAnimating = true;
  showWireframe = true;
  
  private destroy$ = new Subject<void>();
  private sphereInstanceId = 'ico-sphere-modal';
  private resizeObserver?: ResizeObserver;

  constructor(
    private readonly dialogRef: MatDialogRef<IcoSphereModalComponent>,
    private readonly themeService: ThemeService,
    private readonly icoSphereService: IcoSphereService,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  ngOnInit(): void {
    this.currentTheme$ = this.themeService.currentTheme$;
    
    // Subscribe to theme changes
    this.currentTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateSphereTheme();
      });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initSphere();
        this.setupResizeObserver();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (isPlatformBrowser(this.platformId)) {
      this.icoSphereService.destroySphere(this.sphereInstanceId);
      
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
    }
  }

  private initSphere(): void {
    if (!this.sphereContainer?.nativeElement) return;

    const config: IcoSphereConfig = {
      size: 'large',
      animated: true,
      interactive: true,
      pointCount: 200,
      primaryColor: getComputedStyle(document.documentElement)
        .getPropertyValue('--primary-color').trim() || '#1a1a1a',
      secondaryColor: getComputedStyle(document.documentElement)
        .getPropertyValue('--secondary-color').trim() || '#26a69a'
    };

    this.icoSphereService.initSphere(this.sphereContainer, config, this.sphereInstanceId);
  }

  private setupResizeObserver(): void {
    if (!isPlatformBrowser(this.platformId) || !this.sphereContainer?.nativeElement) return;

    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        this.icoSphereService.resizeSphere(this.sphereInstanceId, width, height);
      }
    });

    this.resizeObserver.observe(this.sphereContainer.nativeElement);
  }

  private updateSphereTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary-color').trim() || '#1a1a1a';
    const secondaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--secondary-color').trim() || '#26a69a';

    this.icoSphereService.updateTheme(this.sphereInstanceId, primaryColor, secondaryColor);
  }

  toggleAnimation(): void {
    this.isAnimating = !this.isAnimating;
    
    if (this.isAnimating) {
      this.icoSphereService.resumeAnimation(this.sphereInstanceId);
    } else {
      this.icoSphereService.pauseAnimation(this.sphereInstanceId);
    }
  }

  resetView(): void {
    // Reinitialize the sphere to reset view
    this.icoSphereService.destroySphere(this.sphereInstanceId);
    setTimeout(() => {
      this.initSphere();
    }, 100);
  }

  toggleWireframe(): void {
    this.showWireframe = !this.showWireframe;
    // This would require additional implementation in the service
    // For now, it's a placeholder for the UI
  }

  viewLiveDemo(): void {
    console.log('Navigate to ICO Sphere live demo');
    alert('This would navigate to the live ICO Sphere demo with full interactive features and documentation.');
  }

  viewSourceCode(): void {
    console.log('Navigate to ICO Sphere source code');
    alert('This would open the GitHub repository or source code viewer for the ICO Sphere project.');
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}

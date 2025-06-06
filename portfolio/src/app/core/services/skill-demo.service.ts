import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { gsap } from 'gsap';

export interface DemoConfig {
  readonly skillName: string;
  readonly demoType: 'highcharts' | 'threejs' | 'ag-grid' | 'canvas' | 'gridster' | 'micro-frontend' | 'generic';
  readonly modalWidth?: string;
  readonly modalHeight?: string;
  readonly data?: any;
}

export interface DemoMetrics {
  readonly skillName: string;
  readonly openTime: number;
  readonly interactionCount: number;
  readonly duration: number;
  readonly userAgent: string;
}

@Injectable({
  providedIn: 'root'
})
export class SkillDemoService {
  private currentDemo$ = new BehaviorSubject<string | null>(null);
  private demoMetrics: Map<string, DemoMetrics> = new Map();
  private currentDialogRef: MatDialogRef<any> | null = null;

  constructor(
    private readonly dialog: MatDialog,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  /**
   * Get current active demo observable
   */
  getCurrentDemo(): Observable<string | null> {
    return this.currentDemo$.asObservable();
  }

  /**
   * Open skill demo with performance tracking
   */
  async openSkillDemo(config: DemoConfig): Promise<MatDialogRef<any> | null> {
    if (!isPlatformBrowser(this.platformId)) return null;

    const startTime = performance.now();
    
    try {
      // Close any existing demo
      if (this.currentDialogRef) {
        this.currentDialogRef.close();
      }

      // Set current demo
      this.currentDemo$.next(config.skillName);

      // Dynamic import based on demo type
      const modalComponent = await this.loadDemoComponent(config.demoType);
      
      if (!modalComponent) {
        console.warn(`Demo component not found for ${config.demoType}`);
        return null;
      }

      // Configure modal options
      const modalConfig = {
        width: config.modalWidth || '90vw',
        maxWidth: this.getMaxWidth(config.demoType),
        height: config.modalHeight || 'auto',
        maxHeight: '90vh',
        panelClass: ['skill-demo-modal-panel', `${config.demoType}-demo-panel`],
        disableClose: false,
        autoFocus: true,
        restoreFocus: true,
        data: config.data || { skillName: config.skillName },
        // Performance optimizations
        hasBackdrop: true,
        backdropClass: 'skill-demo-backdrop',
        closeOnNavigation: true
      };

      // Open modal with performance tracking
      this.currentDialogRef = this.dialog.open(modalComponent, modalConfig);

      // Add entrance animation
      this.addModalEntranceAnimation();

      // Track demo metrics
      this.trackDemoOpening(config.skillName, startTime);

      // Handle modal close
      this.currentDialogRef.afterClosed().subscribe(() => {
        this.onDemoClose(config.skillName, startTime);
      });

      return this.currentDialogRef;

    } catch (error) {
      console.error(`Error opening demo for ${config.skillName}:`, error);
      this.currentDemo$.next(null);
      return null;
    }
  }

  /**
   * Close current demo
   */
  closeCurrentDemo(): void {
    if (this.currentDialogRef) {
      this.currentDialogRef.close();
    }
  }

  /**
   * Get demo metrics for performance analysis
   */
  getDemoMetrics(): Map<string, DemoMetrics> {
    return new Map(this.demoMetrics);
  }

  /**
   * Clear demo metrics (for testing/debugging)
   */
  clearMetrics(): void {
    this.demoMetrics.clear();
  }

  /**
   * Track demo interaction for analytics
   */
  trackDemoInteraction(skillName: string, interactionType: string): void {
    const metrics = this.demoMetrics.get(skillName);
    if (metrics) {
      // Update interaction count
      const updatedMetrics: DemoMetrics = {
        ...metrics,
        interactionCount: metrics.interactionCount + 1
      };
      this.demoMetrics.set(skillName, updatedMetrics);
    }

    // Log interaction for analytics
    console.log(`Demo interaction: ${skillName} - ${interactionType}`);
  }

  /**
   * Dynamically load demo component based on type
   */
  private async loadDemoComponent(demoType: string): Promise<any> {
    try {
      switch (demoType) {
        case 'highcharts':
          const { HighchartsDemoModalComponent } = await import('../../features/skills/modals/highcharts-demo-modal.component');
          return HighchartsDemoModalComponent;
        
        case 'threejs':
          const { ThreeJSDemoModalComponent } = await import('../../features/skills/modals/threejs-demo-modal.component');
          return ThreeJSDemoModalComponent;
        
        case 'ag-grid':
          const { AGGridDemoModalComponent } = await import('../../features/skills/modals/ag-grid-demo-modal.component');
          return AGGridDemoModalComponent;
        
        case 'canvas':
          const { CanvasDemoModalComponent } = await import('../../features/skills/modals/canvas-demo-modal.component');
          return CanvasDemoModalComponent;
        
        case 'gridster':
          const { GridsterDemoModalComponent } = await import('../../features/skills/modals/gridster-demo-modal.component');
          return GridsterDemoModalComponent;
        
        case 'micro-frontend':
          const { MicroFrontendDemoModalComponent } = await import('../../features/skills/modals/micro-frontend-demo-modal.component');
          return MicroFrontendDemoModalComponent;
        
        default:
          const { GenericSkillModalComponent } = await import('../../features/skills/modals/generic-skill-modal.component');
          return GenericSkillModalComponent;
      }
    } catch (error) {
      console.error(`Failed to load demo component for ${demoType}:`, error);
      return null;
    }
  }

  /**
   * Get optimal modal width based on demo type
   */
  private getMaxWidth(demoType: string): string {
    switch (demoType) {
      case 'ag-grid':
      case 'gridster':
      case 'micro-frontend':
        return '1200px';
      case 'highcharts':
      case 'threejs':
        return '900px';
      case 'canvas':
        return '800px';
      default:
        return '600px';
    }
  }

  /**
   * Add optimized entrance animation
   */
  private addModalEntranceAnimation(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Use requestAnimationFrame for optimal performance
    requestAnimationFrame(() => {
      const modalElement = document.querySelector('.skill-demo-modal-panel .mat-mdc-dialog-container');
      if (modalElement) {
        gsap.fromTo(modalElement,
          {
            opacity: 0,
            scale: 0.8,
            y: 50,
            rotationX: -10,
            force3D: true
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotationX: 0,
            duration: 0.4,
            ease: 'power3.out',
            clearProps: 'all' // Clean up after animation
          }
        );
      }
    });
  }

  /**
   * Track demo opening metrics
   */
  private trackDemoOpening(skillName: string, startTime: number): void {
    const openTime = performance.now() - startTime;
    
    const metrics: DemoMetrics = {
      skillName,
      openTime,
      interactionCount: 0,
      duration: 0,
      userAgent: navigator.userAgent
    };

    this.demoMetrics.set(skillName, metrics);

    // Log performance metrics
    console.log(`Demo opened: ${skillName} in ${openTime.toFixed(2)}ms`);
    
    // Warn if opening is slow
    if (openTime > 200) {
      console.warn(`Slow demo opening detected: ${skillName} took ${openTime.toFixed(2)}ms`);
    }
  }

  /**
   * Handle demo close and calculate duration
   */
  private onDemoClose(skillName: string, startTime: number): void {
    const totalDuration = performance.now() - startTime;
    
    const metrics = this.demoMetrics.get(skillName);
    if (metrics) {
      const updatedMetrics: DemoMetrics = {
        ...metrics,
        duration: totalDuration
      };
      this.demoMetrics.set(skillName, updatedMetrics);
    }

    // Reset current demo
    this.currentDemo$.next(null);
    this.currentDialogRef = null;

    console.log(`Demo closed: ${skillName} after ${totalDuration.toFixed(2)}ms`);
  }

  /**
   * Get performance recommendations based on metrics
   */
  getPerformanceRecommendations(): string[] {
    const recommendations: string[] = [];
    
    for (const [skillName, metrics] of this.demoMetrics) {
      if (metrics.openTime > 200) {
        recommendations.push(`Consider optimizing ${skillName} demo loading (${metrics.openTime.toFixed(2)}ms)`);
      }
      
      if (metrics.duration > 30000 && metrics.interactionCount === 0) {
        recommendations.push(`${skillName} demo may need better engagement features`);
      }
    }

    return recommendations;
  }

  /**
   * Cleanup service resources
   */
  destroy(): void {
    this.closeCurrentDemo();
    this.demoMetrics.clear();
    this.currentDemo$.complete();
  }
}

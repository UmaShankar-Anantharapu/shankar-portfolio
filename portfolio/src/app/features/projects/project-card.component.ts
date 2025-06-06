import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  PLATFORM_ID,
  Inject,
  AfterViewInit
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SkillsNavigationService } from '../../core/services/skills-navigation.service';
import { ThemeService } from '../../core/services/theme.service';
import { IcoSphereService, IcoSphereConfig } from '../../core/services/ico-sphere.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface Project {
  readonly id: string;
  readonly title: string;
  readonly company: string;
  readonly description: string;
  readonly angularVersion: string;
  readonly technologies: readonly string[];
  readonly category: string;
  readonly size: 'small' | 'medium' | 'large';
  readonly featured: boolean;
}

@Component({
  selector: 'app-project-card',
  template: `
    <article 
      #cardElement
      class="project-card"
      [class]="gridSizeClass"
      [class.featured]="project.featured"
      [attr.data-project-id]="project.id"
      [attr.aria-label]="'Project: ' + project.title + ' at ' + project.company"
      (click)="onCardClick($event)">
      
      <!-- Project Card Content -->
      <div class="card-content">
        <!-- Project Header -->
        <header class="project-header">
          <div class="project-meta">
            <span class="company-badge">{{ project.company }}</span>
            <span class="category-badge">{{ project.category }}</span>
            <!-- Lottie Animation for Celeste -->
            <div *ngIf="project.id === 'celeste'" class="lottie-container">
              <div #celesteLottie class="lottie-animation"></div>
            </div>

            <!-- ICO Sphere Preview for ICO Sphere project -->
            <div *ngIf="isIcoSphere()" class="ico-sphere-container">
              <div #icoSpherePreview class="ico-sphere-preview"
                   [attr.aria-label]="'Interactive 3D sphere preview for ' + project.title">
              </div>
              <div class="sphere-overlay">
                <span class="sphere-label">3D Preview</span>
              </div>
            </div>
          </div>
          <h3 class="project-title">{{ project.title }}</h3>
        </header>

        <!-- Project Body -->
        <div class="project-body">
          <p class="project-description">{{ project.description }}</p>
          
          <div class="project-tech-info">
            <div class="angular-version">
              <span class="version-label">Built with:</span>
              <span class="version-value">{{ project.angularVersion }}</span>
            </div>
            
            <div class="technologies-preview">
              <span class="tech-label">Technologies:</span>
              <div class="tech-tags-preview">
                <span 
                  *ngFor="let tech of project.technologies.slice(0, 3); let i = index" 
                  class="tech-tag-mini"
                  [class.clickable-skill]="isRecognizedSkill(tech)"
                  (click)="onTechClick(tech, $event)"
                  [attr.title]="isRecognizedSkill(tech) ? 'Click to view skill details' : tech">
                  {{ tech }}
                </span>
                <span 
                  *ngIf="project.technologies.length > 3" 
                  class="tech-more">
                  +{{ project.technologies.length - 3 }} more
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Project Footer -->
        <footer class="project-footer">
          <button 
            type="button"
            class="view-details-btn"
            (click)="onViewDetailsClick($event)"
            [attr.aria-label]="'View details for ' + project.title">
            <span class="btn-text">View Details</span>
            <span class="btn-icon" aria-hidden="true">→</span>
          </button>
          
          <div class="project-status" *ngIf="project.featured">
            <span class="featured-badge" aria-label="Featured project">⭐ Featured</span>
          </div>
        </footer>
      </div>

      <!-- Card Overlay for Hover Effects -->
      <div class="card-overlay" aria-hidden="true"></div>
    </article>
  `,
  styleUrls: ['./project-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectCardComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() project!: Project;
  @Input() gridSizeClass: string = '';

  @Output() viewDetails = new EventEmitter<Project>();
  @Output() skillNavigation = new EventEmitter<string>();

  @ViewChild('cardElement', { static: true }) cardElement!: ElementRef;
  @ViewChild('celesteLottie', { static: false }) celesteLottie!: ElementRef;
  @ViewChild('icoSpherePreview', { static: false }) icoSpherePreview!: ElementRef;

  currentTheme$!: Observable<string>;
  private destroy$ = new Subject<void>();
  private sphereInstanceId = '';
  private isHovering = false;

  constructor(
    private readonly skillsNavigationService: SkillsNavigationService,
    private readonly themeService: ThemeService,
    private readonly icoSphereService: IcoSphereService,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {
    this.sphereInstanceId = `ico-sphere-${Math.random().toString(36).substr(2, 9)}`;
  }

  ngOnInit(): void {
    this.currentTheme$ = this.themeService.currentTheme$;

    // Subscribe to skill highlights for visual feedback
    this.skillsNavigationService.highlightedSkill$
      .pipe(takeUntil(this.destroy$))
      .subscribe(highlightedSkill => {
        if (isPlatformBrowser(this.platformId) && highlightedSkill) {
          this.updateSkillHighlight(highlightedSkill);
        }
      });

    // Subscribe to theme changes for ICO Sphere
    this.currentTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.project.id === 'ico-sphere' && this.isHovering) {
          this.updateSphereTheme();
        }
      });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && this.project.id === 'ico-sphere') {
      this.setupIcoSpherePreview();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Cleanup ICO Sphere if it exists
    if (isPlatformBrowser(this.platformId) && this.project.id === 'ico-sphere') {
      this.icoSphereService.destroySphere(this.sphereInstanceId);
    }
  }

  /**
   * Handle card click - delegate to appropriate handler
   */
  onCardClick(event: Event): void {
    // Prevent default card click if clicking on interactive elements
    const target = event.target as HTMLElement;
    if (target.closest('.tech-tag-mini, .view-details-btn')) {
      return;
    }

    // Default card click behavior - could expand card or show quick preview
    this.onViewDetailsClick(event);
  }

  /**
   * Handle technology tag click for skill navigation
   */
  onTechClick(technology: string, event: Event): void {
    event.stopPropagation();
    
    if (this.isRecognizedSkill(technology)) {
      // Emit skill navigation event
      this.skillNavigation.emit(technology);
      
      // Navigate to skills section
      this.skillsNavigationService.navigateToSkill(technology, '/projects');
      
      // Analytics tracking (if implemented)
      this.trackSkillClick(technology);
    }
  }

  /**
   * Handle view details button click
   */
  onViewDetailsClick(event: Event): void {
    event.stopPropagation();
    this.viewDetails.emit(this.project);
  }

  /**
   * Check if technology is a recognized skill
   */
  isRecognizedSkill(technology: string): boolean {
    return this.skillsNavigationService.isRecognizedSkill(technology);
  }

  /**
   * Update visual highlight for skills mentioned in this project
   */
  private updateSkillHighlight(highlightedSkill: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const techTags = this.cardElement.nativeElement.querySelectorAll('.tech-tag-mini');
    
    techTags.forEach((tag: HTMLElement) => {
      const techName = tag.textContent?.trim();
      
      if (techName === highlightedSkill) {
        tag.classList.add('skill-highlighted');
        
        // Add subtle glow effect
        tag.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.6)';
        tag.style.transform = 'scale(1.05)';
        
        // Remove highlight after animation
        setTimeout(() => {
          tag.classList.remove('skill-highlighted');
          tag.style.boxShadow = '';
          tag.style.transform = '';
        }, 2000);
      }
    });
  }

  /**
   * Track skill click for analytics
   */
  private trackSkillClick(technology: string): void {
    // Performance-optimized analytics tracking
    if (isPlatformBrowser(this.platformId)) {
      // Use requestIdleCallback for non-critical analytics
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          console.log(`Skill clicked: ${technology} from project: ${this.project.title}`);
          // Add actual analytics implementation here
        });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          console.log(`Skill clicked: ${technology} from project: ${this.project.title}`);
        }, 0);
      }
    }
  }

  /**
   * Get skill category for styling
   */
  getSkillCategory(technology: string): string {
    const skill = this.skillsNavigationService.getSkillInfo(technology);
    return skill?.category || 'general';
  }

  /**
   * Get skill proficiency for visual indicators
   */
  getSkillProficiency(technology: string): string {
    const skill = this.skillsNavigationService.getSkillInfo(technology);
    return skill?.proficiency || 'intermediate';
  }

  /**
   * Setup ICO Sphere preview for hover interaction
   */
  private setupIcoSpherePreview(): void {
    if (!this.icoSpherePreview?.nativeElement) return;

    const cardElement = this.cardElement.nativeElement;

    // Setup hover listeners for ICO Sphere
    cardElement.addEventListener('mouseenter', () => {
      this.isHovering = true;
      this.initIcoSphere();
    });

    cardElement.addEventListener('mouseleave', () => {
      this.isHovering = false;
      // Delay cleanup to allow for smooth transition
      setTimeout(() => {
        if (!this.isHovering) {
          this.icoSphereService.destroySphere(this.sphereInstanceId);
        }
      }, 300);
    });
  }

  /**
   * Initialize ICO Sphere with theme-aware configuration
   */
  private initIcoSphere(): void {
    if (!this.icoSpherePreview?.nativeElement) return;

    const config: IcoSphereConfig = {
      size: 'small',
      animated: true,
      interactive: false, // Disable interaction for preview
      pointCount: 50, // Reduced for performance
      primaryColor: getComputedStyle(document.documentElement)
        .getPropertyValue('--primary-color').trim() || '#1a1a1a',
      secondaryColor: getComputedStyle(document.documentElement)
        .getPropertyValue('--secondary-color').trim() || '#26a69a'
    };

    this.icoSphereService.initSphere(this.icoSpherePreview, config, this.sphereInstanceId);
  }

  /**
   * Update sphere theme colors
   */
  private updateSphereTheme(): void {
    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary-color').trim() || '#1a1a1a';
    const secondaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--secondary-color').trim() || '#26a69a';

    this.icoSphereService.updateTheme(this.sphereInstanceId, primaryColor, secondaryColor);
  }

  /**
   * Check if project is ICO Sphere
   */
  isIcoSphere(): boolean {
    return this.project.id === 'ico-sphere';
  }

  /**
   * Performance-optimized track by function
   */
  trackByTechnology(index: number, technology: string): string {
    return technology;
  }
}

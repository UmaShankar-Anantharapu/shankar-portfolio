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
  ChangeDetectorRef
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { gsap } from 'gsap';
import { SkillsNavigationService } from '../../../core/services/skills-navigation.service';
import { SkillDemoService } from '../../../core/services/skill-demo.service';

export interface Skill {
  readonly name: string;
  readonly percentage: number;
  readonly category: 'frontend' | 'backend' | 'database' | 'state-management' | 'visualization' | 'graphics' | 'architecture';
  readonly icon: string;
  readonly description: string;
  readonly color?: string;
  readonly hasProjectReference?: boolean; // New property for project navigation
}

@Component({
  selector: 'app-skill-item',
  template: `
    <article 
      #skillCard
      class="skill-card"
      [class.highlighted]="isHighlighted"
      [class.has-project-reference]="skill.hasProjectReference"
      [attr.aria-label]="'Skill: ' + skill.name + ' at ' + skill.percentage + '% proficiency'"
      (mouseenter)="onSkillCardHover($event)"
      (mouseleave)="onSkillCardLeave($event)">
      
      <!-- Skill Header -->
      <div class="skill-header">
        <div class="skill-info">
          <span class="skill-icon" [attr.aria-label]="skill.name + ' icon'">{{ skill.icon }}</span>
          <div class="skill-details">
            <h3 
              class="skill-name"
              [class.clickable-skill]="true"
              [class.project-linked]="skill.hasProjectReference"
              (click)="onSkillNameClick()"
              (mouseenter)="onSkillLabelHover($event)"
              (mouseleave)="onSkillLabelLeave($event)"
              [attr.title]="getSkillTitle()">
              {{ skill.name }}
              <span *ngIf="skill.hasProjectReference" class="project-link-indicator" aria-hidden="true">🔗</span>
            </h3>
            <p class="skill-description">{{ skill.description }}</p>
          </div>
        </div>
        <div class="skill-percentage">
          <span class="percentage-value">{{ skill.percentage }}%</span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="progress-container">
        <div class="progress-track">
          <div 
            #progressBar
            class="progress-bar"
            [style.background-color]="'var(--secondary-color)'"
            [style.width]="'0%'"
            [attr.aria-valuenow]="skill.percentage"
            [attr.aria-valuemin]="0"
            [attr.aria-valuemax]="100"
            [attr.aria-label]="skill.name + ' proficiency: ' + skill.percentage + '%'"
            role="progressbar">
            <div class="progress-glow"></div>
          </div>
        </div>
      </div>

      <!-- Skill Badge -->
      <div class="skill-badge" [style.background-color]="skill.color || 'var(--secondary-color)'">
        <span class="badge-text">{{ getCategoryDisplayName(skill.category) }}</span>
      </div>

      <!-- Performance indicator for project-linked skills -->
      <div *ngIf="skill.hasProjectReference" class="project-indicator" title="Used in projects">
        <span class="indicator-icon">⭐</span>
      </div>
    </article>
  `,
  styleUrls: ['./skill-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillItemComponent implements OnInit, OnDestroy {
  @Input() skill!: Skill;
  @Input() index: number = 0;
  @Input() isHighlighted: boolean = false;

  @Output() skillHover = new EventEmitter<{ skill: Skill; event: MouseEvent }>();
  @Output() skillLeave = new EventEmitter<{ skill: Skill; event: MouseEvent }>();
  @Output() skillClick = new EventEmitter<Skill>();
  @Output() projectNavigation = new EventEmitter<string>();

  @ViewChild('skillCard', { static: true }) skillCard!: ElementRef;
  @ViewChild('progressBar', { static: true }) progressBar!: ElementRef;

  private destroy$ = new Subject<void>();
  private animationInitialized = false;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly skillsNavigationService: SkillsNavigationService,
    private readonly skillDemoService: SkillDemoService,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  ngOnInit(): void {
    // Subscribe to skill highlighting
    this.skillsNavigationService.highlightedSkill$
      .pipe(takeUntil(this.destroy$))
      .subscribe(highlightedSkill => {
        const wasHighlighted = this.isHighlighted;
        this.isHighlighted = highlightedSkill === this.skill.name;
        
        // Only trigger change detection if highlight state changed
        if (wasHighlighted !== this.isHighlighted) {
          this.cdr.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize progress bar animation (called from parent)
   */
  initializeAnimation(delay: number = 0): void {
    if (!isPlatformBrowser(this.platformId) || this.animationInitialized) return;

    this.animationInitialized = true;

    // Animate progress bar with performance optimization
    requestAnimationFrame(() => {
      gsap.fromTo(this.progressBar.nativeElement,
        { 
          width: '0%',
          opacity: 0.7
        },
        {
          width: `${this.skill.percentage}%`,
          opacity: 1,
          duration: 2.0,
          delay: delay,
          ease: 'power2.out',
          onComplete: () => {
            // Add shimmer effect after animation
            this.addProgressBarShimmer();
          }
        }
      );
    });
  }

  /**
   * Handle skill card hover with performance optimization
   */
  onSkillCardHover(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Use requestAnimationFrame for smooth animation
    requestAnimationFrame(() => {
      gsap.to(this.skillCard.nativeElement, {
        scale: 1.02,
        y: -3,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    this.skillHover.emit({ skill: this.skill, event });
  }

  /**
   * Handle skill card leave
   */
  onSkillCardLeave(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;

    requestAnimationFrame(() => {
      gsap.to(this.skillCard.nativeElement, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    this.skillLeave.emit({ skill: this.skill, event });
  }

  /**
   * Handle skill label hover with glow effect
   */
  onSkillLabelHover(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const skillLabel = event.target as HTMLElement;
    
    requestAnimationFrame(() => {
      gsap.to(skillLabel, {
        textShadow: '0 0 20px var(--secondary-color), 0 0 30px var(--secondary-color)',
        color: 'var(--secondary-color)',
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  }

  /**
   * Handle skill label leave
   */
  onSkillLabelLeave(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const skillLabel = event.target as HTMLElement;
    
    requestAnimationFrame(() => {
      gsap.to(skillLabel, {
        textShadow: 'none',
        color: 'var(--text-color)',
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  }

  /**
   * Handle skill name click - either open demo or navigate to projects
   */
  onSkillNameClick(): void {
    // Add click animation
    if (isPlatformBrowser(this.platformId)) {
      requestAnimationFrame(() => {
        gsap.to(this.skillCard.nativeElement, {
          scale: 0.98,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut'
        });
      });
    }

    // Check if skill has project reference
    if (this.skill.hasProjectReference) {
      // Navigate to projects section
      this.projectNavigation.emit(this.skill.name);
    } else {
      // Open skill demo
      this.skillClick.emit(this.skill);
    }
  }

  /**
   * Get skill title based on functionality
   */
  getSkillTitle(): string {
    if (this.skill.hasProjectReference) {
      return `Click to see ${this.skill.name} projects`;
    }
    return `Click to see ${this.skill.name} demo`;
  }

  /**
   * Get category display name
   */
  getCategoryDisplayName(category: string): string {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  /**
   * Add shimmer effect to progress bar
   */
  private addProgressBarShimmer(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const progressBarElement = this.progressBar.nativeElement;
    const shimmer = document.createElement('div');
    shimmer.className = 'progress-shimmer';
    shimmer.style.cssText = `
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      animation: shimmer 2s ease-in-out;
      pointer-events: none;
    `;
    
    progressBarElement.style.position = 'relative';
    progressBarElement.appendChild(shimmer);
    
    // Remove shimmer after animation
    setTimeout(() => {
      if (shimmer.parentNode) {
        shimmer.parentNode.removeChild(shimmer);
      }
    }, 2000);
  }
}

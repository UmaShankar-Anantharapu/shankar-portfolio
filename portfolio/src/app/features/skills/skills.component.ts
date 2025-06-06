import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  Inject,
  ElementRef,
  ViewChildren,
  QueryList
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from '../../core/services/theme.service';
import { SkillsNavigationService } from '../../core/services/skills-navigation.service';
import { SkillDemoService, DemoConfig } from '../../core/services/skill-demo.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface Skill {
  readonly name: string;
  readonly percentage: number;
  readonly category: 'frontend' | 'backend' | 'database' | 'state-management' | 'visualization' | 'graphics' | 'architecture';
  readonly icon: string;
  readonly description: string;
  readonly color?: string;
  readonly hasProjectReference?: boolean; // New property for project navigation
}

export interface AngularTimelineItem {
  readonly version: string;
  readonly year: string;
  readonly project: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly color: string;
  readonly icon: string;
}

@Component({
  selector: 'app-skills',
  template: `
    <section class="skills-section" role="main" aria-labelledby="skills-title">
      <!-- Skills Header -->
      <header class="skills-header">
        <h1 id="skills-title" class="skills-title">My Skills</h1>
        <p class="skills-subtitle">
          Technical expertise and proficiency across frontend, backend, and specialized technologies
        </p>
      </header>

      <!-- Angular Timeline Section -->
      <div class="angular-timeline-section" role="region" aria-labelledby="angular-timeline-title">
        <div class="timeline-header">
          <h2 id="angular-timeline-title" class="timeline-title">
            <span class="timeline-icon">🅰️</span>
            Angular Journey Timeline
          </h2>
          <p class="timeline-subtitle">
            My evolution with Angular framework across different versions and projects
          </p>
        </div>

        <div class="timeline-container">
          <div class="timeline-line" aria-hidden="true"></div>
          <div class="angular-timeline-chips" aria-label="Angular version timeline">
            <div
              *ngFor="let item of angularTimeline; trackBy: trackByTimelineItem; let i = index"
              #timelineChip
              class="timeline-chip"
              [class.even]="i % 2 === 0"
              [class.odd]="i % 2 === 1"
              [style.--chip-color]="item.color"
              [attr.aria-label]="item.version + ': ' + item.project + ' (' + item.year + ')'"
              [attr.role]="'button'"
              [attr.tabindex]="0"
              (click)="onTimelineChipClick(item, i)"
              (keydown.enter)="onTimelineChipClick(item, i)"
              (keydown.space)="onTimelineChipClick(item, i)"
              (mouseenter)="onTimelineChipHover($event, item)"
              (mouseleave)="onTimelineChipLeave($event, item)">

              <div class="chip-content">
                <div class="chip-header">
                  <span class="chip-icon" aria-hidden="true">{{ item.icon }}</span>
                  <div class="chip-version-info">
                    <span class="chip-version">{{ item.version }}</span>
                    <span class="chip-year">{{ item.year }}</span>
                  </div>
                </div>

                <div class="chip-project">
                  <h4 class="project-name">{{ item.project }}</h4>
                  <p class="project-description">{{ item.description }}</p>
                </div>

                <div class="chip-features">
                  <span class="features-label">Key Features:</span>
                  <div class="features-list">
                    <span
                      *ngFor="let feature of item.features; let last = last"
                      class="feature-tag">
                      {{ feature }}<span *ngIf="!last" class="feature-separator">, </span>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Timeline connector -->
              <div class="timeline-connector" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills Categories -->
      <div class="skills-container">
        <div
          *ngFor="let category of skillCategories; trackBy: trackByCategory"
          class="skill-category"
          [attr.aria-labelledby]="category.key + '-title'">

          <!-- Category Header -->
          <div class="category-header">
            <span class="category-icon" aria-hidden="true">{{ category.icon }}</span>
            <h2 [id]="category.key + '-title'" class="category-title">{{ category.name }}</h2>
          </div>

          <!-- Performance-Optimized Skills Grid -->
          <div class="skills-grid">
            <app-skill-item
              *ngFor="let skill of getSkillsByCategory(category.key); trackBy: trackBySkill; let i = index"
              [skill]="skill"
              [index]="i"
              (skillClick)="onSkillClick($event)"
              (projectNavigation)="onProjectNavigation($event)"
              (skillHover)="onSkillHover($event)"
              (skillLeave)="onSkillLeave($event)">
            </app-skill-item>
          </div>
        </div>
      </div>

      <!-- Skills Summary -->
      <footer class="skills-summary">
        <div class="summary-stats">
          <div class="stat-item">
            <span class="stat-number">{{ skills.length }}</span>
            <span class="stat-label">Technologies</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ skillCategories.length }}</span>
            <span class="stat-label">Categories</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ getAverageSkillPercentage() }}%</span>
            <span class="stat-label">Avg Proficiency</span>
          </div>
        </div>

        <div class="skills-note">
          <p class="note-text">
            <strong>Note:</strong> Proficiency percentages reflect practical experience and project complexity handled.
            Continuously learning and improving across all technologies.
          </p>
        </div>
      </footer>
    </section>
  `,
  styleUrls: ['./skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('progressBar') progressBars!: QueryList<ElementRef>;
  @ViewChildren('skillCard') skillCards!: QueryList<ElementRef>;
  @ViewChildren('timelineChip') timelineChips!: QueryList<ElementRef>;

  currentTheme$!: Observable<string>;
  private destroy$ = new Subject<void>();
  private scrollTriggers: ScrollTrigger[] = [];

  readonly skills: readonly Skill[] = [
    // Frontend Technologies
    {
      name: 'Angular',
      percentage: 95,
      category: 'frontend',
      icon: '🅰️',
      description: 'Expert in Angular framework with 5+ years experience',
      color: '#dd0031',
      hasProjectReference: true
    },
    {
      name: 'JavaScript',
      percentage: 90,
      category: 'frontend',
      icon: '🟨',
      description: 'Advanced JavaScript ES6+ and modern features',
      color: '#f7df1e',
      hasProjectReference: true
    },
    {
      name: 'TypeScript',
      percentage: 90,
      category: 'frontend',
      icon: '🔷',
      description: 'Strong typing and advanced TypeScript patterns',
      color: '#3178c6',
      hasProjectReference: true
    },
    {
      name: 'HTML5',
      percentage: 85,
      category: 'frontend',
      icon: '🌐',
      description: 'Semantic HTML and modern web standards',
      color: '#e34f26'
    },
    {
      name: 'CSS3',
      percentage: 85,
      category: 'frontend',
      icon: '🎨',
      description: 'Advanced CSS, Flexbox, Grid, and animations',
      color: '#1572b6'
    },

    // Backend Technologies
    {
      name: 'Node.js',
      percentage: 80,
      category: 'backend',
      icon: '🟢',
      description: 'Server-side JavaScript and API development',
      color: '#339933',
      hasProjectReference: true
    },
    {
      name: 'MySQL',
      percentage: 75,
      category: 'database',
      icon: '🗄️',
      description: 'Database design and query optimization',
      color: '#4479a1'
    },

    // State Management
    {
      name: 'NgRx',
      percentage: 85,
      category: 'state-management',
      icon: '🔄',
      description: 'Angular state management with NgRx Store',
      color: '#764abc',
      hasProjectReference: true
    },
    {
      name: 'RxJS',
      percentage: 85,
      category: 'state-management',
      icon: '⚡',
      description: 'Reactive programming with observables',
      color: '#b7178c',
      hasProjectReference: true
    },
    {
      name: 'Redux',
      percentage: 80,
      category: 'state-management',
      icon: '🔀',
      description: 'Predictable state container for JavaScript',
      color: '#764abc'
    },

    // Data Visualization
    {
      name: 'Highcharts',
      percentage: 90,
      category: 'visualization',
      icon: '📊',
      description: 'Advanced charting and data visualization',
      color: '#8085e9'
    },
    {
      name: 'AG-Grid',
      percentage: 85,
      category: 'visualization',
      icon: '📋',
      description: 'Enterprise data grid solutions',
      color: '#ff6600'
    },
    {
      name: 'AG-Charts',
      percentage: 80,
      category: 'visualization',
      icon: '📈',
      description: 'Professional charting library',
      color: '#ff6600'
    },
    {
      name: 'NGX-Charts',
      percentage: 80,
      category: 'visualization',
      icon: '📉',
      description: 'Angular-native charting components',
      color: '#aa1e72'
    },
    {
      name: 'Gridster',
      percentage: 80,
      category: 'visualization',
      icon: '🔲',
      description: 'Drag and drop dashboard layouts',
      color: '#42a5f5'
    },

    // Graphics & 3D
    {
      name: 'Fabric.js',
      percentage: 80,
      category: 'graphics',
      icon: '🖼️',
      description: 'Canvas manipulation and interactive graphics',
      color: '#ff6b6b'
    },
    {
      name: 'Konva.js',
      percentage: 80,
      category: 'graphics',
      icon: '🎭',
      description: '2D canvas graphics and animations',
      color: '#4ecdc4'
    },
    {
      name: 'Three.js',
      percentage: 85,
      category: 'graphics',
      icon: '🎮',
      description: '3D graphics and WebGL rendering',
      color: '#000000',
      hasProjectReference: true
    },

    // Architecture
    {
      name: 'Micro Frontend',
      percentage: 90,
      category: 'architecture',
      icon: '🏗️',
      description: 'Scalable frontend architecture patterns',
      color: '#26a69a',
      hasProjectReference: true
    }
  ];

  readonly skillCategories = [
    { key: 'frontend', name: 'Frontend Technologies', icon: '💻' },
    { key: 'backend', name: 'Backend Technologies', icon: '⚙️' },
    { key: 'database', name: 'Database', icon: '🗄️' },
    { key: 'state-management', name: 'State Management', icon: '🔄' },
    { key: 'visualization', name: 'Data Visualization', icon: '📊' },
    { key: 'graphics', name: 'Graphics & 3D', icon: '🎨' },
    { key: 'architecture', name: 'Architecture', icon: '🏗️' }
  ] as const;

  // Angular Timeline Data
  readonly angularTimeline: readonly AngularTimelineItem[] = [
    {
      version: 'Angular 8',
      year: '2019-2020',
      project: 'CIS (Career Information System)',
      description: 'Built comprehensive career management system with dynamic forms and routing',
      features: ['Dynamic Forms', 'Lazy Loading', 'Angular Material', 'RxJS Operators'],
      color: '#dd0031',
      icon: '🚀'
    },
    {
      version: 'Angular 13',
      year: '2021-2022',
      project: 'Career Trek & Photoshooto',
      description: 'Developed modern applications with Ivy renderer and standalone components',
      features: ['Ivy Renderer', 'Angular Universal', 'Standalone Components', 'Angular CLI'],
      color: '#c3002f',
      icon: '⚡'
    },
    {
      version: 'Angular 15',
      year: '2022-2023',
      project: 'IOT Dashboard & NH Cam',
      description: 'Created real-time IoT monitoring dashboards with advanced data visualization',
      features: ['Standalone APIs', 'Optional Injectors', 'Extended Developer Tools', 'Image Optimization'],
      color: '#a6002a',
      icon: '📊'
    },
    {
      version: 'Angular 17',
      year: '2023-2024',
      project: 'ICO Sphere (Brane Enterprises)',
      description: 'Built interactive 3D visualization platform with new control flow syntax',
      features: ['New Control Flow', 'SSR Improvements', 'View Transitions API', 'Hybrid Rendering'],
      color: '#8b0024',
      icon: '🎮'
    },
    {
      version: 'Angular 18',
      year: '2024-Present',
      project: 'Celeste (Greenko)',
      description: 'Developing enterprise-scale renewable energy platform with Material 3 and Zoneless',
      features: ['Material 3 Design', 'Zoneless Change Detection', 'Control Flow Stable', 'Built-in Hydration'],
      color: '#70001f',
      icon: '🌟'
    }
  ];

  constructor(
    private readonly themeService: ThemeService,
    private readonly skillsNavigationService: SkillsNavigationService,
    private readonly skillDemoService: SkillDemoService,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {
    // Register GSAP plugins
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  ngOnInit(): void {
    this.currentTheme$ = this.themeService.currentTheme$;
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initializeAnimations();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (isPlatformBrowser(this.platformId)) {
      this.cleanupAnimations();
    }
  }

  /**
   * Initialize enhanced GSAP animations for skills
   */
  private initializeAnimations(): void {
    // Enhanced skill card animations with staggered entrance
    this.skillCards.forEach((card, index) => {
      const trigger = ScrollTrigger.create({
        trigger: card.nativeElement,
        start: 'top 80%',
        onEnter: () => {
          // Card entrance animation
          gsap.fromTo(card.nativeElement,
            {
              opacity: 0,
              y: 60,
              scale: 0.8,
              rotationY: -15,
              force3D: true
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotationY: 0,
              duration: 0.8,
              delay: index * 0.2, // Increased stagger to 0.2s
              ease: 'power3.out'
            }
          );
        },
        once: true
      });

      this.scrollTriggers.push(trigger);
    });

    // Enhanced progress bar animations with improved timing
    this.progressBars.forEach((progressBar, index) => {
      const skillIndex = this.getSkillIndexForProgressBar(progressBar);
      const skill = this.skills[skillIndex];

      if (skill) {
        const trigger = ScrollTrigger.create({
          trigger: progressBar.nativeElement,
          start: 'top 80%',
          onEnter: () => {
            // Progress bar fill animation
            gsap.fromTo(progressBar.nativeElement,
              {
                width: '0%',
                opacity: 0.7
              },
              {
                width: `${skill.percentage}%`,
                opacity: 1,
                duration: 2.0,
                delay: 0.5 + (index * 0.2), // Staggered by 0.2s
                ease: 'power2.out'
              }
            );

            // Add shimmer effect during animation
            this.addProgressBarShimmer(progressBar.nativeElement);
          },
          once: true
        });

        this.scrollTriggers.push(trigger);
      }
    });

    // Animate summary statistics
    this.animateSummaryStats();

    // Animate Angular timeline
    this.animateAngularTimeline();
  }

  /**
   * Cleanup GSAP animations
   */
  private cleanupAnimations(): void {
    this.scrollTriggers.forEach(trigger => trigger.kill());
    this.scrollTriggers = [];
  }

  /**
   * Get skills by category
   */
  getSkillsByCategory(category: string): Skill[] {
    return this.skills.filter(skill => skill.category === category);
  }

  /**
   * Track by function for ngFor optimization
   */
  trackBySkill(index: number, skill: Skill): string {
    return skill.name;
  }

  /**
   * Track by function for categories
   */
  trackByCategory(index: number, category: any): string {
    return category.key;
  }

  /**
   * Get progress bar style with theme colors
   */
  getProgressBarStyle(skill: Skill): { [key: string]: string } {
    return {
      'background-color': 'var(--secondary-color)',
      'width': '0%' // Will be animated by GSAP
    };
  }

  /**
   * Get skill card hover effect
   */
  onSkillCardHover(event: MouseEvent, skill: Skill): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const card = event.currentTarget as HTMLElement;
    gsap.to(card, {
      scale: 1.05,
      y: -5,
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  /**
   * Remove skill card hover effect
   */
  onSkillCardLeave(event: MouseEvent, skill: Skill): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const card = event.currentTarget as HTMLElement;
    gsap.to(card, {
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
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
   * Get average skill percentage
   */
  getAverageSkillPercentage(): number {
    const total = this.skills.reduce((sum, skill) => sum + skill.percentage, 0);
    return Math.round(total / this.skills.length);
  }

  /**
   * Track by function for timeline items
   */
  trackByTimelineItem(index: number, item: AngularTimelineItem): string {
    return item.version;
  }

  /**
   * Handle timeline chip click
   */
  onTimelineChipClick(item: AngularTimelineItem, index: number): void {
    console.log(`Timeline chip clicked: ${item.version} - ${item.project}`);

    // Add click animation
    if (isPlatformBrowser(this.platformId)) {
      const chipElement = this.timelineChips.toArray()[index]?.nativeElement;
      if (chipElement) {
        gsap.to(chipElement, {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut'
        });
      }
    }

    // Navigate to projects section for this Angular version
    this.skillsNavigationService.navigateToProjects('Angular');
  }

  /**
   * Handle timeline chip hover
   */
  onTimelineChipHover(event: MouseEvent, item: AngularTimelineItem): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const chipElement = event.currentTarget as HTMLElement;

    gsap.to(chipElement, {
      scale: 1.05,
      y: -5,
      boxShadow: `0 10px 30px ${item.color}40`,
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  /**
   * Handle timeline chip leave
   */
  onTimelineChipLeave(event: MouseEvent, item: AngularTimelineItem): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const chipElement = event.currentTarget as HTMLElement;

    gsap.to(chipElement, {
      scale: 1,
      y: 0,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  /**
   * Get skill index for progress bar element
   */
  private getSkillIndexForProgressBar(progressBar: ElementRef): number {
    const progressBarsArray = this.progressBars.toArray();
    return progressBarsArray.indexOf(progressBar);
  }

  /**
   * Add shimmer effect to progress bar during animation
   */
  private addProgressBarShimmer(progressBarElement: HTMLElement): void {
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

  /**
   * Animate summary statistics
   */
  private animateSummaryStats(): void {
    const summarySection = document.querySelector('.skills-summary');
    if (summarySection) {
      const trigger = ScrollTrigger.create({
        trigger: summarySection,
        start: 'top 80%',
        onEnter: () => {
          const statNumbers = summarySection.querySelectorAll('.stat-number');

          statNumbers.forEach((statNumber, index) => {
            const finalValue = parseInt(statNumber.textContent || '0');
            const obj = { value: 0 };

            gsap.to(obj, {
              value: finalValue,
              duration: 2,
              delay: index * 0.3,
              ease: 'power2.out',
              onUpdate: () => {
                statNumber.textContent = Math.round(obj.value) + (statNumber.textContent?.includes('%') ? '%' : '');
              }
            });
          });
        },
        once: true
      });

      this.scrollTriggers.push(trigger);
    }
  }

  /**
   * Animate Angular timeline chips
   */
  private animateAngularTimeline(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Wait for timeline chips to be rendered
    setTimeout(() => {
      const timelineSection = document.querySelector('.angular-timeline-section');
      if (timelineSection && this.timelineChips.length > 0) {

        // Set initial state for timeline chips
        const chipElements = this.timelineChips.map(chip => chip.nativeElement);
        gsap.set(chipElements, {
          opacity: 0,
          y: 50,
          scale: 0.8,
          force3D: true
        });

        // Create scroll trigger for timeline animation
        const timelineScrollTrigger = ScrollTrigger.create({
          trigger: timelineSection,
          start: 'top 80%',
          onEnter: () => {
            // Animate timeline line first
            const timelineLine = timelineSection.querySelector('.timeline-line');
            if (timelineLine) {
              gsap.fromTo(timelineLine,
                { scaleX: 0 },
                {
                  scaleX: 1,
                  duration: 1.5,
                  ease: 'power2.out'
                }
              );
            }

            // Animate chips with stagger
            gsap.to(chipElements, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              delay: 0.5, // Start after timeline line animation
              stagger: 0.2, // 0.2s stagger as requested
              ease: 'power3.out',
              force3D: true,
              onComplete: () => {
                // Add subtle floating animation after entrance
                chipElements.forEach((chip, index) => {
                  gsap.to(chip, {
                    y: -3,
                    duration: 2 + (index * 0.1),
                    repeat: -1,
                    yoyo: true,
                    ease: 'power1.inOut',
                    delay: index * 0.2
                  });
                });
              }
            });
          },
          once: true
        });

        this.scrollTriggers.push(timelineScrollTrigger);
      }
    }, 200);
  }

  /**
   * Handle skill label hover with glow effect
   */
  onSkillLabelHover(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const skillLabel = event.target as HTMLElement;

    gsap.to(skillLabel, {
      textShadow: '0 0 20px var(--secondary-color), 0 0 30px var(--secondary-color), 0 0 40px var(--secondary-color)',
      color: 'var(--secondary-color)',
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  /**
   * Remove skill label hover effect
   */
  onSkillLabelLeave(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const skillLabel = event.target as HTMLElement;

    gsap.to(skillLabel, {
      textShadow: 'none',
      color: 'var(--text-color)',
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  /**
   * Handle skill click to open demo modal
   */
  onSkillClick(skill: Skill): void {
    console.log(`Opening demo for ${skill.name}`);

    // Use the shared demo service for consistency
    const demoConfig: DemoConfig = {
      skillName: skill.name,
      demoType: this.getDemoType(skill.name),
      data: { skill }
    };

    this.skillDemoService.openSkillDemo(demoConfig);
  }

  /**
   * Handle project navigation from skill click
   */
  onProjectNavigation(skillName: string): void {
    console.log(`Navigating to projects for skill: ${skillName}`);
    this.skillsNavigationService.navigateToProjects(skillName);
  }

  /**
   * Handle skill hover events
   */
  onSkillHover(event: { skill: Skill; event: MouseEvent }): void {
    // Optional: Add global hover effects or analytics
    console.log(`Hovering over skill: ${event.skill.name}`);
  }

  /**
   * Handle skill leave events
   */
  onSkillLeave(event: { skill: Skill; event: MouseEvent }): void {
    // Optional: Add global leave effects or analytics
  }

  /**
   * Get demo type based on skill name
   */
  private getDemoType(skillName: string): DemoConfig['demoType'] {
    switch (skillName.toLowerCase()) {
      case 'highcharts':
        return 'highcharts';
      case 'three.js':
        return 'threejs';
      case 'ag-grid':
        return 'ag-grid';
      case 'fabric.js':
      case 'konva.js':
        return 'canvas';
      case 'gridster':
        return 'gridster';
      case 'micro frontend':
        return 'micro-frontend';
      default:
        return 'generic';
    }
  }




}

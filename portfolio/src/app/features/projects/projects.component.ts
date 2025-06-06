import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectionStrategy, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from '../../core/services/theme.service';
import { SkillsNavigationService } from '../../core/services/skills-navigation.service';
import { CelesteKpiModalComponent } from './celeste-kpi-modal.component';
import { IcoSphereModalComponent } from './ico-sphere-modal.component';
import { Project } from './project-card.component';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import lottie from 'lottie-web';

// Project interface moved to project-card.component.ts for better organization

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('bentoGrid', { static: false }) bentoGrid!: ElementRef;
  @ViewChild('celesteLottie', { static: false }) celesteLottie!: ElementRef;

  currentTheme$!: Observable<string>;
  private scrollTriggers: ScrollTrigger[] = [];
  private animationFrameId: number | null = null;
  private lottieAnimation: any = null;
  private destroy$ = new Subject<void>();

  readonly projects: readonly Project[] = [
    {
      id: 'celeste',
      title: 'Celeste',
      company: 'Greenko Group',
      description: 'Enterprise-grade renewable energy management platform built with Angular 16. Features real-time monitoring, advanced analytics, and comprehensive reporting for solar and wind energy assets.',
      angularVersion: 'Angular 16',
      technologies: ['Angular', 'TypeScript', 'RxJS', 'Highcharts', 'Azure', 'Material Design'],
      category: 'Enterprise',
      size: 'large',
      featured: true
    },
    {
      id: 'iot-dashboard',
      title: 'IOT Dashboard',
      company: 'Brane Enterprises',
      description: 'Comprehensive IoT device monitoring dashboard using Angular 15. Real-time data visualization, device management, and predictive analytics for industrial IoT applications.',
      angularVersion: 'Angular 15',
      technologies: ['Angular', 'TypeScript', 'Three.js', 'WebSocket', 'AG-Grid', 'D3.js'],
      category: 'IoT',
      size: 'large',
      featured: true
    },
    {
      id: 'ico-sphere',
      title: 'ICO Sphere',
      company: 'Brane Enterprises',
      description: 'Interactive 3D visualization platform built with Angular 14. Features immersive 3D environments, real-time rendering, and advanced user interactions using Three.js.',
      angularVersion: 'Angular 14',
      technologies: ['Angular', 'TypeScript', 'Three.js', 'WebGL', 'GSAP', 'Cannon.js'],
      category: '3D Visualization',
      size: 'medium',
      featured: true
    },
    {
      id: 'nh-cam',
      title: 'NH Cam',
      company: 'Brane Enterprises',
      description: 'Advanced camera management system developed with Angular 14. Provides live streaming, recording capabilities, and intelligent video analytics for security applications.',
      angularVersion: 'Angular 14',
      technologies: ['Angular', 'TypeScript', 'WebRTC', 'Socket.io', 'OpenCV.js', 'FFmpeg'],
      category: 'Media',
      size: 'medium',
      featured: false
    },
    {
      id: 'cis',
      title: 'CIS (Customer Information System)',
      company: 'Sree Tech / Zinovia',
      description: 'Comprehensive customer management platform built with Angular 12. Features customer data management, analytics, and reporting with modern UI/UX design.',
      angularVersion: 'Angular 12',
      technologies: ['Angular', 'TypeScript', 'Bootstrap', 'Chart.js', 'REST APIs', 'JWT'],
      category: 'CRM',
      size: 'medium',
      featured: false
    },
    {
      id: 'career-trek',
      title: 'Career Trek',
      company: 'Sree Tech',
      description: 'Career guidance and job portal application developed with Angular 11. Includes job matching algorithms, resume builder, and career assessment tools.',
      angularVersion: 'Angular 11',
      technologies: ['Angular', 'TypeScript', 'Bootstrap', 'Node.js', 'MongoDB', 'Express'],
      category: 'Career',
      size: 'small',
      featured: false
    },
    {
      id: 'photoshooto',
      title: 'Photoshooto',
      company: 'Zinovia',
      description: 'Photography portfolio and booking platform created with Angular 10. Features image galleries, booking system, and photographer portfolio management.',
      angularVersion: 'Angular 10',
      technologies: ['Angular', 'JavaScript', 'SASS', 'jQuery', 'PHP', 'MySQL'],
      category: 'Portfolio',
      size: 'small',
      featured: false
    }
  ] as const;

  constructor(
    private readonly themeService: ThemeService,
    private readonly skillsNavigationService: SkillsNavigationService,
    private readonly dialog: MatDialog,
    private readonly cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  ngOnInit(): void {
    this.currentTheme$ = this.themeService.currentTheme$;

    // Subscribe to skill highlights for performance monitoring
    this.skillsNavigationService.highlightedSkill$
      .pipe(takeUntil(this.destroy$))
      .subscribe(skill => {
        if (skill && isPlatformBrowser(this.platformId)) {
          this.onSkillHighlighted(skill);
        }
      });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Use requestAnimationFrame for better performance
      this.animationFrameId = requestAnimationFrame(() => {
        this.initScrollTriggerAnimations();
        this.initHoverEffects();
        this.initLottieAnimation();
      });
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();

    // Clean up animations and prevent memory leaks
    if (isPlatformBrowser(this.platformId)) {
      this.cleanupAnimations();
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.lottieAnimation) {
      this.lottieAnimation.destroy();
    }
  }

  // Track by function for ngFor performance optimization
  trackByProjectId(index: number, project: Project): string {
    return project.id;
  }

  // Get grid size class for Bento layout
  getGridSizeClass(project: Project): string {
    switch (project.size) {
      case 'large':
        return 'col-span-2 row-span-2';
      case 'medium':
        return 'col-span-2 row-span-1';
      case 'small':
        return 'col-span-1 row-span-1';
      default:
        return 'col-span-1 row-span-1';
    }
  }

  // Get featured projects count
  getFeaturedProjectsCount(): number {
    return this.projects.filter(project => project.featured).length;
  }

  // Handle skill navigation from project cards
  onSkillNavigation(skillName: string): void {
    // Performance-optimized skill navigation
    if (isPlatformBrowser(this.platformId)) {
      // Use requestIdleCallback for non-critical operations
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          this.trackSkillNavigation(skillName);
        });
      }

      // Navigate to skill immediately for better UX
      this.skillsNavigationService.navigateToSkill(skillName, '/projects');
    }
  }

  // Handle skill highlighting for visual feedback
  private onSkillHighlighted(skillName: string): void {
    // Trigger change detection only when necessary
    this.cdr.markForCheck();

    // Add visual feedback to project cards containing the skill
    this.highlightProjectsWithSkill(skillName);
  }

  // Highlight projects that contain the specified skill
  private highlightProjectsWithSkill(skillName: string): void {
    if (!this.bentoGrid?.nativeElement) return;

    const projectCards = this.bentoGrid.nativeElement.querySelectorAll('.project-card');

    projectCards.forEach((card: HTMLElement) => {
      const projectId = card.getAttribute('data-project-id');
      const project = this.projects.find(p => p.id === projectId);

      if (project && project.technologies.includes(skillName)) {
        // Add subtle highlight to the entire project card
        gsap.to(card, {
          borderColor: '#FFD700',
          borderWidth: '3px',
          duration: 0.3,
          ease: 'power2.out'
        });

        // Remove highlight after 2 seconds
        setTimeout(() => {
          gsap.to(card, {
            borderColor: project.featured ? 'var(--secondary-color)' : 'rgba(38, 166, 154, 0.1)',
            borderWidth: project.featured ? '2px' : '1px',
            duration: 0.3,
            ease: 'power2.out'
          });
        }, 2000);
      }
    });
  }

  // Track skill navigation for analytics
  private trackSkillNavigation(skillName: string): void {
    console.log(`Skill navigation: ${skillName} from Projects page`);
    // Add actual analytics implementation here
  }

  // Initialize GSAP ScrollTrigger animations
  private initScrollTriggerAnimations(): void {
    if (!this.bentoGrid?.nativeElement) return;

    const projectCards = this.bentoGrid.nativeElement.querySelectorAll('.project-card');

    if (projectCards.length > 0) {
      // Set initial state for cards
      gsap.set(projectCards, {
        opacity: 0,
        y: 60,
        scale: 0.9,
        force3D: true
      });

      // Create staggered animation on scroll
      const scrollTrigger = ScrollTrigger.create({
        trigger: this.bentoGrid.nativeElement,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          gsap.to(projectCards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.3,
            ease: 'power2.out',
            force3D: true
          });
        },
        onLeave: () => {
          gsap.to(projectCards, {
            opacity: 0,
            y: -30,
            scale: 0.95,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power2.in',
            force3D: true
          });
        },
        onEnterBack: () => {
          gsap.to(projectCards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.3,
            ease: 'power2.out',
            force3D: true
          });
        },
        onLeaveBack: () => {
          gsap.to(projectCards, {
            opacity: 0,
            y: 60,
            scale: 0.9,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power2.in',
            force3D: true
          });
        }
      });

      this.scrollTriggers.push(scrollTrigger);
    }
  }

  // Initialize hover effects for project cards
  private initHoverEffects(): void {
    if (!this.bentoGrid?.nativeElement) return;

    const projectCards = this.bentoGrid.nativeElement.querySelectorAll('.project-card');

    projectCards.forEach((card: HTMLElement) => {
      // Mouse enter effect
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.05,
          duration: 0.4,
          ease: 'power2.out',
          force3D: true
        });

        // Add secondary color border
        gsap.to(card, {
          borderColor: 'var(--secondary-color)',
          borderWidth: '2px',
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      // Mouse leave effect
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
          force3D: true
        });

        // Reset border
        gsap.to(card, {
          borderColor: 'rgba(38, 166, 154, 0.1)',
          borderWidth: '1px',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }

  // Initialize Lottie animation for Celeste card
  private initLottieAnimation(): void {
    if (!this.celesteLottie?.nativeElement) return;

    // Create a simple chart animation using Lottie
    this.lottieAnimation = lottie.loadAnimation({
      container: this.celesteLottie.nativeElement,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      animationData: this.getChartAnimationData()
    });

    // Add hover effects for Celeste card
    const celesteCard = this.bentoGrid?.nativeElement?.querySelector('[data-project-id="celeste"]');
    if (celesteCard) {
      celesteCard.addEventListener('mouseenter', () => {
        this.lottieAnimation?.play();

        // Enhanced hover effect for Celeste
        gsap.to(celesteCard, {
          scale: 1.08,
          duration: 0.4,
          ease: 'power2.out',
          force3D: true
        });
      });

      celesteCard.addEventListener('mouseleave', () => {
        this.lottieAnimation?.pause();

        gsap.to(celesteCard, {
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
          force3D: true
        });
      });
    }
  }

  // Get chart animation data for Lottie
  private getChartAnimationData(): any {
    // Simple chart pulse animation data
    return {
      "v": "5.7.4",
      "fr": 30,
      "ip": 0,
      "op": 60,
      "w": 100,
      "h": 100,
      "nm": "Chart Pulse",
      "ddd": 0,
      "assets": [],
      "layers": [
        {
          "ddd": 0,
          "ind": 1,
          "ty": 4,
          "nm": "Chart",
          "sr": 1,
          "ks": {
            "o": {"a": 0, "k": 100},
            "r": {"a": 0, "k": 0},
            "p": {"a": 0, "k": [50, 50, 0]},
            "a": {"a": 0, "k": [0, 0, 0]},
            "s": {
              "a": 1,
              "k": [
                {"i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 0, "s": [100]},
                {"i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 30, "s": [120]},
                {"t": 60, "s": [100]}
              ]
            }
          },
          "ao": 0,
          "shapes": [
            {
              "ty": "gr",
              "it": [
                {
                  "ty": "rc",
                  "d": 1,
                  "s": {"a": 0, "k": [30, 30]},
                  "p": {"a": 0, "k": [0, 0]},
                  "r": {"a": 0, "k": 4}
                },
                {
                  "ty": "fl",
                  "c": {"a": 0, "k": [0.149, 0.651, 0.604, 1]},
                  "o": {"a": 0, "k": 100}
                }
              ]
            }
          ],
          "ip": 0,
          "op": 60,
          "st": 0
        }
      ]
    };
  }

  // Clean up all animations
  private cleanupAnimations(): void {
    // Kill all GSAP animations
    gsap.killTweensOf('*');

    // Clean up ScrollTrigger instances
    this.scrollTriggers.forEach(trigger => trigger.kill());
    this.scrollTriggers = [];

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();
  }

  // Handle view details click
  onViewDetails(project: Project): void {
    if (project.id === 'celeste') {
      this.openCelesteModal();
    } else if (project.id === 'ico-sphere') {
      this.openIcoSphereModal();
    } else {
      // Placeholder for other projects
      console.log(`View details for project: ${project.title}`);
      alert(`View Details for ${project.title}\n\nThis is a placeholder for the project details view. In a real application, this would navigate to a detailed project page or open a modal with more information.`);
    }
  }

  // Open Celeste KPI modal
  private openCelesteModal(): void {
    const dialogRef = this.dialog.open(CelesteKpiModalComponent, {
      width: '90vw',
      maxWidth: '600px',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: 'celeste-modal-panel',
      disableClose: false,
      autoFocus: true,
      restoreFocus: true
    });

    // Add entrance animation to modal
    dialogRef.afterOpened().subscribe(() => {
      const modalElement = document.querySelector('.celeste-modal-panel .mat-mdc-dialog-container');
      if (modalElement) {
        gsap.fromTo(modalElement,
          {
            opacity: 0,
            scale: 0.8,
            y: 50
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
          }
        );
      }
    });

    dialogRef.beforeClosed().subscribe(() => {
      const modalElement = document.querySelector('.celeste-modal-panel .mat-mdc-dialog-container');
      if (modalElement) {
        gsap.to(modalElement, {
          opacity: 0,
          scale: 0.9,
          y: -20,
          duration: 0.3,
          ease: 'power2.in'
        });
      }
    });
  }

  // Open ICO Sphere modal
  private openIcoSphereModal(): void {
    const dialogRef = this.dialog.open(IcoSphereModalComponent, {
      width: '95vw',
      maxWidth: '800px',
      height: 'auto',
      maxHeight: '95vh',
      panelClass: 'ico-sphere-modal-panel',
      disableClose: false,
      autoFocus: true,
      restoreFocus: true
    });

    // Add entrance animation to modal
    dialogRef.afterOpened().subscribe(() => {
      const modalElement = document.querySelector('.ico-sphere-modal-panel .mat-mdc-dialog-container');
      if (modalElement) {
        gsap.fromTo(modalElement,
          {
            opacity: 0,
            scale: 0.8,
            y: 50,
            rotationY: -15
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotationY: 0,
            duration: 0.6,
            ease: 'power2.out'
          }
        );
      }
    });

    dialogRef.beforeClosed().subscribe(() => {
      const modalElement = document.querySelector('.ico-sphere-modal-panel .mat-mdc-dialog-container');
      if (modalElement) {
        gsap.to(modalElement, {
          opacity: 0,
          scale: 0.9,
          y: -30,
          rotationY: 15,
          duration: 0.3,
          ease: 'power2.in'
        });
      }
    });
  }
}

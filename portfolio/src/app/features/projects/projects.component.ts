import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectionStrategy, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from '../../core/services/theme.service';
import { SkillsNavigationService } from '../../core/services/skills-navigation.service';
import { CelesteKpiModalComponent } from './celeste-kpi-modal.component';
import { IcoSphereModalComponent } from './ico-sphere-modal.component';
import { ProjectDetailModalComponent } from './project-detail-modal.component';
import { Project } from './project-card.component';
import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;

  currentTheme$!: Observable<string>;
  searchQuery = '';
  filteredProjects: Project[] = [];
  isSearching = false;

  private scrollTriggers: ScrollTrigger[] = [];
  private animationFrameId: number | null = null;
  private lottieAnimation: any = null;
  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

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
      keyFeatures: ['Real-time Monitoring', 'Advanced Analytics', 'Comprehensive Reporting', 'Asset Management'],
      fullDescription: 'Celeste is a comprehensive renewable energy management platform designed for enterprise-scale operations. The platform provides real-time monitoring of solar and wind energy assets, advanced analytics for performance optimization, and detailed reporting capabilities. Built with Angular 16 and integrated with Azure cloud services, it handles massive amounts of data while maintaining optimal performance.',
      myRole: 'Senior Frontend Developer - Led the frontend architecture design, implemented real-time data visualization components, and optimized performance for large-scale data handling.',
      duration: '8 months',
      teamSize: 6,
      challenges: ['Handling real-time data streams', 'Complex data visualization requirements', 'Performance optimization for large datasets', 'Integration with multiple IoT devices'],
      achievements: ['Reduced data loading time by 60%', 'Implemented real-time dashboard with 99.9% uptime', 'Created reusable component library', 'Achieved 95+ Lighthouse performance score'],
      demoUrl: 'https://celeste-demo.greenkogroup.com',
      sourceCodeUrl: 'https://github.com/greenko/celeste-frontend'
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
      keyFeatures: ['Real-time Device Monitoring', 'Predictive Analytics', 'Alert Management', '3D Visualization'],
      fullDescription: 'A sophisticated IoT dashboard that monitors thousands of industrial devices in real-time. Features include predictive analytics for maintenance scheduling, customizable alert systems, and immersive 3D visualizations of device networks. The platform processes millions of data points daily while maintaining sub-second response times.',
      myRole: 'Frontend Developer - Developed real-time data visualization components, implemented WebSocket connections for live updates, and created 3D device network visualizations using Three.js.',
      duration: '10 months',
      teamSize: 8,
      challenges: ['Real-time data synchronization', 'Complex 3D visualizations', 'Scalable architecture for thousands of devices', 'Cross-platform compatibility'],
      achievements: ['Processed 1M+ data points per minute', 'Achieved 99.5% uptime', 'Reduced false alerts by 40%', 'Implemented predictive maintenance algorithms'],
      demoUrl: 'https://iot-demo.braneenterprises.com',
      sourceCodeUrl: 'https://github.com/brane/iot-dashboard'
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
      keyFeatures: ['Interactive 3D Environments', 'Real-time Rendering', 'Physics Simulation', 'Advanced Animations'],
      fullDescription: 'ICO Sphere is an innovative 3D visualization platform that creates immersive interactive environments. Built with cutting-edge WebGL technology and Three.js, it features real-time physics simulations, advanced lighting systems, and smooth animations. The platform is optimized for both desktop and mobile devices.',
      myRole: 'Frontend Developer - Implemented 3D rendering engine, developed physics simulations, created interactive user interfaces, and optimized performance for various devices.',
      duration: '6 months',
      teamSize: 4,
      challenges: ['Complex 3D mathematics', 'Performance optimization for mobile', 'Cross-browser WebGL compatibility', 'Real-time physics calculations'],
      achievements: ['60fps performance on mobile devices', 'Cross-browser compatibility 95%+', 'Reduced loading time by 50%', 'Implemented advanced shader effects'],
      demoUrl: 'https://ico-sphere-demo.braneenterprises.com'
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
      keyFeatures: ['Live Streaming', 'Motion Detection', 'Cloud Recording', 'Mobile App Integration'],
      fullDescription: 'NH Cam is a comprehensive camera management system designed for security and surveillance applications. It provides real-time video streaming, intelligent motion detection, cloud-based recording, and mobile app integration. The system supports multiple camera types and offers advanced video analytics capabilities.',
      myRole: 'Frontend Developer - Developed video streaming interfaces, implemented real-time communication protocols, created mobile-responsive UI, and integrated video analytics features.',
      duration: '7 months',
      teamSize: 5,
      challenges: ['Real-time video streaming optimization', 'Cross-platform mobile compatibility', 'Bandwidth optimization', 'Video codec integration'],
      achievements: ['Reduced streaming latency by 70%', 'Achieved 99.8% uptime', 'Implemented AI-powered motion detection', 'Created responsive mobile interface'],
      demoUrl: 'https://nh-cam-demo.braneenterprises.com'
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
      keyFeatures: ['Customer Data Management', 'Analytics Dashboard', 'Report Generation', 'User Role Management'],
      fullDescription: 'CIS is a robust customer information system designed to streamline customer data management for businesses. It features comprehensive customer profiles, advanced analytics dashboards, automated report generation, and flexible user role management. The system integrates with multiple data sources and provides real-time insights.',
      myRole: 'Frontend Developer - Designed and implemented customer management interfaces, developed analytics dashboards, created reporting modules, and implemented responsive design patterns.',
      duration: '9 months',
      teamSize: 6,
      challenges: ['Complex data relationships', 'Performance with large datasets', 'Multi-tenant architecture', 'Advanced reporting requirements'],
      achievements: ['Managed 100K+ customer records', 'Reduced data processing time by 45%', 'Implemented role-based access control', 'Created automated reporting system'],
      demoUrl: 'https://cis-demo.sreetech.com'
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
      keyFeatures: ['Job Matching Algorithm', 'Resume Builder', 'Career Assessment', 'Interview Preparation'],
      fullDescription: 'Career Trek is an innovative career guidance platform that helps job seekers find their ideal career path. It features intelligent job matching algorithms, a comprehensive resume builder, career assessment tools, and interview preparation resources. The platform uses machine learning to provide personalized career recommendations.',
      myRole: 'Frontend Developer - Developed user interfaces for job matching, implemented resume builder functionality, created assessment modules, and designed responsive layouts.',
      duration: '5 months',
      teamSize: 4,
      challenges: ['Algorithm integration', 'Dynamic form generation', 'PDF generation for resumes', 'User experience optimization'],
      achievements: ['Matched 5000+ job seekers', 'Generated 10K+ resumes', 'Achieved 85% user satisfaction', 'Implemented ML-based recommendations'],
      demoUrl: 'https://career-trek-demo.sreetech.com'
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
      keyFeatures: ['Portfolio Galleries', 'Booking System', 'Payment Integration', 'Mobile Optimization'],
      fullDescription: 'Photoshooto is a comprehensive photography platform that connects photographers with clients. It features stunning portfolio galleries, an integrated booking system, secure payment processing, and mobile-optimized interfaces. The platform supports multiple photographer profiles and provides tools for portfolio management.',
      myRole: 'Frontend Developer - Created responsive gallery interfaces, implemented booking system UI, integrated payment gateways, and optimized mobile experience.',
      duration: '4 months',
      teamSize: 3,
      challenges: ['Image optimization', 'Payment gateway integration', 'Mobile responsiveness', 'Gallery performance'],
      achievements: ['Optimized image loading by 60%', 'Integrated multiple payment methods', 'Achieved mobile-first design', 'Created reusable gallery components'],
      demoUrl: 'https://photoshooto-demo.zinovia.com'
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

    // Initialize filtered projects with all projects
    this.filteredProjects = [...this.projects];

    // Set up search functionality with debouncing
    this.searchSubject$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        this.performSearch(query);
      });

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

  // Get total projects count
  getTotalProjectsCount(): number {
    return this.projects.length;
  }

  // Search functionality
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.searchSubject$.next(this.searchQuery);
  }

  // Clear search
  clearSearch(): void {
    this.searchQuery = '';
    this.searchSubject$.next('');
    if (this.searchInput?.nativeElement) {
      this.searchInput.nativeElement.focus();
    }
  }

  // Perform search with animation
  private performSearch(query: string): void {
    this.isSearching = true;

    if (!query.trim()) {
      this.filteredProjects = [...this.projects];
    } else {
      const searchTerm = query.toLowerCase();
      this.filteredProjects = this.projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm) ||
        project.company.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchTerm)) ||
        project.category.toLowerCase().includes(searchTerm) ||
        project.keyFeatures.some(feature => feature.toLowerCase().includes(searchTerm))
      );
    }

    // Animate search results
    if (isPlatformBrowser(this.platformId)) {
      this.animateSearchResults();
    }

    this.isSearching = false;
    this.cdr.markForCheck();
  }

  // Animate search results
  private animateSearchResults(): void {
    if (!this.bentoGrid?.nativeElement) return;

    const projectCards = this.bentoGrid.nativeElement.querySelectorAll('.project-card');

    // Fade out and then fade in with stagger
    gsap.to(projectCards, {
      opacity: 0,
      scale: 0.9,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        // Wait for Angular to update the DOM
        setTimeout(() => {
          const newCards = this.bentoGrid.nativeElement.querySelectorAll('.project-card');
          gsap.fromTo(newCards,
            {
              opacity: 0,
              scale: 0.9,
              y: 20
            },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.1,
              ease: 'power2.out'
            }
          );
        }, 50);
      }
    });
  }

  // Handle project card click to open appropriate modal
  onProjectCardClick(project: Project): void {
    if (project.id === 'celeste') {
      this.dialog.open(CelesteKpiModalComponent, {
        width: '90vw',
        maxWidth: '1200px',
        height: '90vh',
        panelClass: ['custom-modal-panel', 'celeste-modal'],
        data: { project }
      });
    } else if (project.id === 'ico-sphere') {
      this.dialog.open(IcoSphereModalComponent, {
        width: '90vw',
        maxWidth: '1000px',
        height: '90vh',
        panelClass: ['custom-modal-panel', 'ico-sphere-modal'],
        data: { project }
      });
    } else {
      // Use generic project detail modal for all other projects
      this.dialog.open(ProjectDetailModalComponent, {
        width: '90vw',
        maxWidth: '900px',
        height: '90vh',
        panelClass: ['custom-modal-panel', 'project-detail-modal'],
        data: { project }
      });
    }
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
            borderColor: 'rgba(38, 166, 154, 0.1)',
            borderWidth: '1px',
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

  // Handle view details (legacy method for compatibility)
  onViewDetails(project: Project): void {
    this.onProjectCardClick(project);
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


}

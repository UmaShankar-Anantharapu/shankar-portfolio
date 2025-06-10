import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins only in browser
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StatCard {
  readonly number: string;
  readonly label: string;
  readonly icon: string;
  readonly clickable: boolean;
  readonly action?: string;
}

interface WorkExperience {
  readonly company: string;
  readonly duration: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly position: string;
  readonly keyProjects: readonly string[];
  readonly technologies: readonly string[];
  readonly icon: string;
  readonly logoUrl: string;
  readonly isExpanded?: boolean;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('statsContainer', { static: false }) statsContainer!: ElementRef;
  @ViewChild('aboutText', { static: false }) aboutText!: ElementRef;
  @ViewChild('voiceButton', { static: false }) voiceButton!: ElementRef;
  @ViewChild('timelineContainer', { static: false }) timelineContainer!: ElementRef;

  private readonly destroy$ = new Subject<void>();
  private animationFrameId?: number;
  private scrollTriggers: ScrollTrigger[] = [];

  currentTheme$!: Observable<string>;
  isNarrating = false;
  speechSynthesis?: SpeechSynthesis;
  currentUtterance?: SpeechSynthesisUtterance;

  // Readonly stats array for better performance
  readonly stats: readonly StatCard[] = [
    {
      number: '6+',
      label: 'Years Experience',
      icon: '💼',
      clickable: false
    },
    {
      number: '6+',
      label: 'Projects Completed',
      icon: '🚀',
      clickable: true,
      action: 'projects'
    },
    {
      number: '4',
      label: 'Companies Worked With',
      icon: '🏢',
      clickable: true,
      action: 'projects'
    }
  ] as const;

  // Work experience timeline data with accordion state management
  workExperience: WorkExperience[] = [
    {
      company: 'Greenko Group',
      duration: 'Dec 2024 - Present',
      startDate: 'Dec 2024',
      endDate: 'Present',
      position: 'Senior Software Engineer',
      keyProjects: [
        'Renewable Energy Dashboard',
        'Real-time Monitoring System',
        'Performance Analytics Platform'
      ],
      technologies: ['Angular', 'TypeScript', 'RxJS', 'Highcharts', 'Azure'],
      icon: '🌱',
      logoUrl: 'https://greenkogroup.com/images/new-logo.svg',
      isExpanded: false
    },
    {
      company: 'Brane Enterprises',
      duration: 'Dec 2022 - Nov 2024',
      startDate: 'Dec 2022',
      endDate: 'Nov 2024',
      position: 'Software Engineer',
      keyProjects: [
        'Celeste - Enterprise Application',
        'IOT Dashboard Development',
        'Micro Frontend Architecture'
      ],
      technologies: ['Angular', 'TypeScript', 'Micro Frontends', 'AG-Grid', 'Three.js'],
      icon: '🚀',
      logoUrl: 'assets/images/logos/brane-logo.svg',
      isExpanded: false
    },
    {
      company: 'Tech Tammina',
      duration: 'Oct 2021 - Dec 2022',
      startDate: 'Oct 2021',
      endDate: 'Dec 2022',
      position: 'Frontend Developer',
      keyProjects: [
        'E-commerce Platform',
        'Customer Management System',
        'Responsive Web Applications'
      ],
      technologies: ['Angular', 'JavaScript', 'Bootstrap', 'REST APIs', 'Git'],
      icon: '💻',
      logoUrl: 'assets/images/logos/tech-tammina-logo.svg',
      isExpanded: false
    },
    {
      company: 'Zino Technologies',
      duration: 'Aug 2019 - Sep 2021',
      startDate: 'Aug 2019',
      endDate: 'Sep 2021',
      position: 'Junior Frontend Developer',
      keyProjects: [
        'Corporate Website Development',
        'UI/UX Implementation',
        'Cross-browser Compatibility'
      ],
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'SASS'],
      icon: '🎯',
      logoUrl: 'https://zinotechnologies.com/images/logo-wide.png',
      isExpanded: false
    }
  ];

  // Optimized content for voice narration
  private readonly aboutContent = `I'm a Software Engineer with 6 years of experience in Angular frontend development,
    specializing in Micro Frontend architecture. Throughout my career, I've had the
    opportunity to work with cutting-edge technologies and contribute to innovative
    projects that have shaped my expertise in modern web development.

    My journey in software development has been driven by a passion for creating
    efficient, scalable, and user-friendly applications. I have extensive experience
    in building complex enterprise applications using Angular, RxJS, and various
    visualization libraries like Highcharts and AG-Grid.

    I specialize in Micro Frontend architecture, which allows for better scalability,
    maintainability, and team collaboration. My experience includes developing projects
    like Celeste and IOT Dashboard, where I've implemented advanced features such as
    real-time data visualization, interactive dashboards, and performance optimization.`;

  constructor(
    private readonly themeService: ThemeService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {
    // Initialize speech synthesis only in browser
    if (isPlatformBrowser(this.platformId) && 'speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
    }
  }

  ngOnInit(): void {
    this.currentTheme$ = this.themeService.currentTheme$;
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Use requestAnimationFrame for better performance
      this.animationFrameId = requestAnimationFrame(() => {
        this.initScrollTriggerAnimations();
        this.initHoverEffects();
        this.initTimelineAnimations();
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Clean up animations and speech
    this.cleanupAnimations();
    this.stopNarration();

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  // Performance-optimized stat card click handler
  onStatCardClick(stat: StatCard): void {
    if (!stat.clickable || !stat.action) return;

    if (stat.action === 'projects') {
      this.scrollToProjects();
    }
  }

  // Optimized scroll to projects section
  private scrollToProjects(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Try to find projects section in current page first
    const projectsSection = document.querySelector('#projects');

    if (projectsSection) {
      // Smooth scroll to projects section
      projectsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    } else {
      // Navigate to home page with projects fragment
      this.router.navigate(['/'], { fragment: 'projects' }).then(() => {
        // Wait for navigation and then scroll
        setTimeout(() => {
          const projectsElement = document.querySelector('#projects');
          if (projectsElement) {
            projectsElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
          }
        }, 100);
      });
    }
  }

  private initScrollTriggerAnimations(): void {
    if (!this.statsContainer?.nativeElement || !this.aboutText?.nativeElement) return;

    // Animate stats cards with staggered slide up effect
    const statCards = this.statsContainer.nativeElement.querySelectorAll('.stat-card');

    if (statCards.length > 0) {
      gsap.set(statCards, {
        y: 80,
        opacity: 0,
        force3D: true // Hardware acceleration
      });

      const statsScrollTrigger = ScrollTrigger.create({
        trigger: this.statsContainer.nativeElement,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          gsap.to(statCards, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            force3D: true
          });
        },
        onLeave: () => {
          gsap.to(statCards, {
            y: -80,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.in',
            force3D: true
          });
        },
        onEnterBack: () => {
          gsap.to(statCards, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            force3D: true
          });
        },
        onLeaveBack: () => {
          gsap.to(statCards, {
            y: 80,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.in',
            force3D: true
          });
        }
      });

      this.scrollTriggers.push(statsScrollTrigger);
    }

    // Animate about text paragraphs with fade in effect
    const paragraphs = this.aboutText.nativeElement.querySelectorAll('.about-paragraph');

    if (paragraphs.length > 0) {
      gsap.set(paragraphs, {
        opacity: 0,
        y: 30,
        force3D: true
      });

      const textScrollTrigger = ScrollTrigger.create({
        trigger: this.aboutText.nativeElement,
        start: 'top 75%',
        end: 'bottom 25%',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          gsap.to(paragraphs, {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.3,
            ease: 'power2.out',
            force3D: true
          });
        },
        onLeave: () => {
          gsap.to(paragraphs, {
            opacity: 0,
            y: -30,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.in',
            force3D: true
          });
        },
        onEnterBack: () => {
          gsap.to(paragraphs, {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.3,
            ease: 'power2.out',
            force3D: true
          });
        },
        onLeaveBack: () => {
          gsap.to(paragraphs, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.in',
            force3D: true
          });
        }
      });

      this.scrollTriggers.push(textScrollTrigger);
    }
  }

  private initTimelineAnimations(): void {
    if (!this.timelineContainer?.nativeElement) return;

    // Animate timeline steps with staggered fade in effect
    const timelineSteps = this.timelineContainer.nativeElement.querySelectorAll('.timeline-step');

    if (timelineSteps.length > 0) {
      gsap.set(timelineSteps, {
        opacity: 0,
        y: 50,
        force3D: true
      });

      const timelineScrollTrigger = ScrollTrigger.create({
        trigger: this.timelineContainer.nativeElement,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          gsap.to(timelineSteps, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2, // Reduced stagger for better flow
            ease: 'power2.out',
            force3D: true
          });
        },
        onLeave: () => {
          gsap.to(timelineSteps, {
            opacity: 0,
            y: -50,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.in',
            force3D: true
          });
        },
        onEnterBack: () => {
          gsap.to(timelineSteps, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            force3D: true
          });
        },
        onLeaveBack: () => {
          gsap.to(timelineSteps, {
            opacity: 0,
            y: 50,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.in',
            force3D: true
          });
        }
      });

      this.scrollTriggers.push(timelineScrollTrigger);
    }
  }

  private initHoverEffects(): void {
    if (!this.statsContainer?.nativeElement) return;

    const statCards = this.statsContainer.nativeElement.querySelectorAll('.stat-card');

    statCards.forEach((card: HTMLElement, index: number) => {
      const stat = this.stats[index];

      // Add cursor pointer for clickable cards
      if (stat?.clickable) {
        card.style.cursor = 'pointer';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Click to view ${stat.label.toLowerCase()}`);
      }

      // Optimized mouse enter effect with passive listeners
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out',
          force3D: true
        });

        gsap.to(card, {
          borderColor: 'var(--secondary-color)',
          borderWidth: '3px',
          duration: 0.3,
          ease: 'power2.out'
        });
      }, { passive: true });

      // Optimized mouse leave effect
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
          force3D: true
        });

        gsap.to(card, {
          borderColor: 'var(--secondary-color)',
          borderWidth: '2px',
          duration: 0.3,
          ease: 'power2.out'
        });
      }, { passive: true });

      // Add keyboard support for clickable cards
      if (stat?.clickable) {
        card.addEventListener('keydown', (event: KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.onStatCardClick(stat);
          }
        });
      }
    });
  }

  toggleVoiceNarration(): void {
    if (this.isNarrating) {
      this.stopNarration();
    } else {
      this.startNarration();
    }

    // Trigger change detection for OnPush strategy
    this.cdr.markForCheck();
  }

  private startNarration(): void {
    if (!isPlatformBrowser(this.platformId) || !this.speechSynthesis) {
      this.showVoiceNotSupported();
      return;
    }

    // Check if running on iOS for Grok 3 voice mode placeholder
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      this.showGrokVoicePlaceholder();
      return;
    }

    // Stop any existing narration
    this.stopNarration();

    // Create new utterance
    this.currentUtterance = new SpeechSynthesisUtterance(this.aboutContent);

    // Configure voice settings for optimal performance
    this.currentUtterance.rate = 0.9;
    this.currentUtterance.pitch = 1;
    this.currentUtterance.volume = 0.8;

    // Set up optimized event listeners
    this.currentUtterance.onstart = () => {
      this.isNarrating = true;
      this.animateVoiceButton(true);
      this.cdr.markForCheck();
    };

    this.currentUtterance.onend = () => {
      this.isNarrating = false;
      this.animateVoiceButton(false);
      this.cdr.markForCheck();
    };

    this.currentUtterance.onerror = () => {
      this.isNarrating = false;
      this.animateVoiceButton(false);
      this.cdr.markForCheck();
      console.error('Speech synthesis error');
    };

    // Start speaking
    this.speechSynthesis.speak(this.currentUtterance);
  }

  private stopNarration(): void {
    if (this.speechSynthesis && this.isNarrating) {
      this.speechSynthesis.cancel();
      this.isNarrating = false;
      this.animateVoiceButton(false);
      this.cdr.markForCheck();
    }
  }

  private animateVoiceButton(isActive: boolean): void {
    if (!this.voiceButton?.nativeElement) return;

    if (isActive) {
      // Optimized pulsing animation while speaking
      gsap.to(this.voiceButton.nativeElement, {
        scale: 1.1,
        duration: 0.5,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
        force3D: true
      });
    } else {
      // Stop pulsing and return to normal
      gsap.killTweensOf(this.voiceButton.nativeElement);
      gsap.to(this.voiceButton.nativeElement, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
        force3D: true
      });
    }
  }

  private showGrokVoicePlaceholder(): void {
    // Placeholder for Grok 3 voice mode integration
    const message = `🎤 Grok 3 Voice Mode Available!\n\nThis feature would integrate with Grok 3's advanced voice capabilities on iOS for natural speech synthesis.\n\nFeatures:\n• Natural voice with emotion\n• Multiple voice options\n• Real-time speech processing\n• Enhanced accessibility`;

    alert(message);

    // Simulate Grok 3 voice activation
    this.isNarrating = true;
    this.animateVoiceButton(true);
    this.cdr.markForCheck();

    // Simulate voice duration (placeholder)
    setTimeout(() => {
      this.isNarrating = false;
      this.animateVoiceButton(false);
      this.cdr.markForCheck();
    }, 5000);
  }

  private showVoiceNotSupported(): void {
    const message = 'Voice narration is not supported in this browser. Please try using a modern browser with speech synthesis support.';
    alert(message);
  }

  private cleanupAnimations(): void {
    // Clean up all ScrollTrigger instances
    this.scrollTriggers.forEach(trigger => trigger.kill());
    this.scrollTriggers = [];

    // Kill all GSAP animations
    if (this.statsContainer?.nativeElement) {
      gsap.killTweensOf(this.statsContainer.nativeElement.querySelectorAll('.stat-card'));
    }

    if (this.aboutText?.nativeElement) {
      gsap.killTweensOf(this.aboutText.nativeElement.querySelectorAll('.about-paragraph'));
    }

    if (this.voiceButton?.nativeElement) {
      gsap.killTweensOf(this.voiceButton.nativeElement);
    }

    if (this.timelineContainer?.nativeElement) {
      gsap.killTweensOf(this.timelineContainer.nativeElement.querySelectorAll('.mat-step'));
    }
  }

  // Track by function for ngFor performance optimization
  trackByStatIndex(index: number, stat: StatCard): string {
    return `${stat.number}-${stat.label}`;
  }

  // Track by function for work experience timeline
  trackByWorkExperience(index: number, work: WorkExperience): string {
    return `${work.company}-${work.startDate}`;
  }

  // Toggle accordion state for work experience
  toggleWorkExperience(index: number, event?: Event): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Prevent default for keyboard events
    if (event && event instanceof KeyboardEvent) {
      event.preventDefault();
    }

    const experience = this.workExperience[index];
    const wasExpanded = experience.isExpanded;

    // Update state
    this.workExperience[index] = {
      ...experience,
      isExpanded: !wasExpanded
    };

    // Animate the content with GSAP
    this.animateAccordionContent(index, !wasExpanded);

    // Add subtle haptic feedback for mobile devices
    if ('vibrate' in navigator && !wasExpanded) {
      navigator.vibrate(50);
    }

    // Trigger change detection for OnPush strategy
    this.cdr.markForCheck();
  }

  // Animate accordion content with GSAP
  private animateAccordionContent(index: number, isExpanding: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const timelineSteps = this.timelineContainer?.nativeElement?.querySelectorAll('.timeline-step');
    if (!timelineSteps || !timelineSteps[index]) return;

    const contentElement = timelineSteps[index].querySelector('.step-content') as HTMLElement;
    if (!contentElement) return;

    if (isExpanding) {
      // Show the element first
      contentElement.style.display = 'block';

      // Get the natural height
      const naturalHeight = contentElement.scrollHeight;

      // Expanding animation
      gsap.fromTo(contentElement,
        {
          height: 0,
          opacity: 0,
          y: -20,
          force3D: true
        },
        {
          height: naturalHeight,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          force3D: true,
          onComplete: () => {
            // Set height to auto after animation for responsive behavior
            contentElement.style.height = 'auto';
          }
        }
      );
    } else {
      // Get current height before collapsing
      const currentHeight = contentElement.offsetHeight;

      // Collapsing animation
      gsap.fromTo(contentElement,
        {
          height: currentHeight,
          opacity: 1,
          y: 0,
          force3D: true
        },
        {
          height: 0,
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: 'power2.in',
          force3D: true,
          onComplete: () => {
            contentElement.style.display = 'none';
          }
        }
      );
    }
  }
}

import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeService } from '../../core/services/theme.service';
import { ThreejsCubeService } from '../../core/services/threejs-cube.service';
import { PerformanceMonitorService } from '../../core/services/performance-monitor.service';
import { TechnologyModalComponent, TechnologyModalData } from '../../shared/components/modals/technology-modal.component';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cubeContainer') cubeContainer!: ElementRef;
  @ViewChild('profileImage') profileImage!: ElementRef;
  @ViewChild('profileContainer') profileContainer!: ElementRef;
  @ViewChild('heroGreeting') heroGreeting!: ElementRef;
  @ViewChild('heroSubtitle') heroSubtitle!: ElementRef;
  @ViewChild('typewriterText') typewriterText!: ElementRef;
  @ViewChild('cursor') cursor!: ElementRef;
  @ViewChild('socialIcons') socialIcons!: ElementRef;
  @ViewChild('socialOverlay') socialOverlay!: ElementRef;

  currentTheme$!: Observable<string>;

  // Enhanced typewriter effect properties
  typewriterTextContent = 'Software engineer with 6+ years in Angular frontend development';
  private typewriterIndex = 0;
  private typewriterSpeed = 80; // milliseconds per character
  private eraseSpeed = 40; // milliseconds per character (faster erasing)
  private pauseBeforeErase = 2000; // pause before starting to erase
  private pauseBeforeType = 500; // pause before starting to type again
  private isTyping = true;
  private typewriterTimeout: any;

  socialLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com/umashankar.anantharapu',
      icon: 'facebook'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/umashankar_dev',
      icon: 'twitter'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/umashankar-anantharapu',
      icon: 'linkedin'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/umashankar.dev',
      icon: 'instagram'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/umashankar-anantharapu',
      icon: 'github'
    }
  ];

  private technologyData: { [key: string]: TechnologyModalData } = {
    'Angular': {
      technology: 'Angular',
      title: 'Angular Framework',
      description: 'Expert in Angular frontend development with micro-frontend architecture.',
      responsibilities: [
        'Developed Celeste and IOT Dashboard with MFE architecture',
        'Implemented component-based architecture',
        'Optimized application performance',
        'Led frontend development team'
      ],
      demoType: 'flowchart'
    },
    'RxJS': {
      technology: 'RxJS',
      title: 'Reactive Programming with RxJS',
      description: 'Specialized in reactive programming and state management optimization.',
      responsibilities: [
        'Optimized state management in CIS application',
        'Implemented complex data streams',
        'Reduced memory leaks by 40%',
        'Enhanced application responsiveness'
      ],
      demoType: 'stream'
    },
    'Highcharts': {
      technology: 'Highcharts',
      title: 'Data Visualization with Highcharts',
      description: 'Project: Celeste | Role: Software Engineer',
      responsibilities: [
        'Developed interactive dashboards with real-time data',
        'Integrated Highcharts for complex visualizations',
        'Configured KPI cards and performance metrics',
        'Optimized chart rendering performance'
      ],
      demoType: 'chart'
    },
    'AG-Grid': {
      technology: 'AG-Grid',
      title: 'Advanced Data Grids',
      description: 'Implementation of complex data grids with advanced features.',
      responsibilities: [
        'Implemented enterprise-grade data grids',
        'Custom cell renderers and editors',
        'Server-side data processing',
        'Export and filtering capabilities'
      ],
      demoType: 'grid'
    },
    'Gridster': {
      technology: 'Gridster',
      title: 'Dynamic Layout Management',
      description: 'Creating responsive and draggable dashboard layouts.',
      responsibilities: [
        'Implemented draggable dashboard widgets',
        'Responsive grid layout system',
        'Widget persistence and configuration',
        'User customizable interfaces'
      ],
      demoType: 'gridster'
    },
    'Three.js': {
      technology: 'Three.js',
      title: '3D Graphics and Animation',
      description: 'Creating immersive 3D experiences and visualizations.',
      responsibilities: [
        'Developed 3D data visualizations',
        'Interactive 3D user interfaces',
        'Performance optimization for 3D scenes',
        'WebGL shader programming'
      ],
      demoType: 'sphere'
    },
    'Fabric.js/Konva.js': {
      technology: 'Fabric.js/Konva.js',
      title: 'Canvas Manipulation Libraries',
      description: 'Interactive 2D graphics and drawing applications using modern canvas libraries.',
      responsibilities: [
        'Built interactive drawing applications',
        'Implemented custom shape manipulation tools',
        'Created dynamic canvas-based visualizations',
        'Optimized canvas performance for complex graphics'
      ],
      demoType: 'sphere' // Using sphere demo as placeholder for canvas graphics
    },
    'MFE Architecture': {
      technology: 'MFE Architecture',
      title: 'Micro Frontend Architecture',
      description: 'Scalable enterprise application architecture using micro frontend patterns.',
      responsibilities: [
        'Designed modular micro frontend systems',
        'Implemented independent deployment strategies',
        'Created shared component libraries',
        'Established inter-app communication protocols'
      ],
      demoType: 'flowchart' // Using flowchart demo for architecture diagrams
    }
  };

  private componentLoadMeasure?: () => void;

  constructor(
    private themeService: ThemeService,
    private threejsCubeService: ThreejsCubeService,
    private performanceMonitor: PerformanceMonitorService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Start performance monitoring
    this.componentLoadMeasure = this.performanceMonitor.measureComponentLoad('HomeComponent');
    this.currentTheme$ = this.themeService.currentTheme$;
  }

  ngAfterViewInit(): void {
    // Performance optimization: Use setTimeout to defer heavy operations
    setTimeout(() => {
      this.initAnimations();
    }, 0);

    setTimeout(() => {
      this.initThreeJsCube();
    }, 100);

    setTimeout(() => {
      this.initTypewriterEffect();
    }, 1500);

    setTimeout(() => {
      this.initFloatingElements();
      this.initSocialAnimations();
      // Complete performance measurement
      if (this.componentLoadMeasure) {
        this.componentLoadMeasure();
      }
    }, 200);
  }

  ngOnDestroy(): void {
    // Performance cleanup: Prevent memory leaks
    this.threejsCubeService.destroy();

    // Clean up typewriter timeout
    if (this.typewriterTimeout) {
      clearTimeout(this.typewriterTimeout);
    }

    // Clean up any remaining timeouts or intervals
    if (this.componentLoadMeasure) {
      this.componentLoadMeasure = undefined;
    }

    // Clean up GSAP animations
    gsap.killTweensOf("*");
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }

  private initAnimations(): void {
    // Enhanced GSAP animations with top-aligned layout
    const tl = gsap.timeline();

    // Animate greeting text at top
    tl.fromTo(this.heroGreeting.nativeElement,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );

    // Animate tagline container (before typewriter starts)
    tl.fromTo(this.heroSubtitle.nativeElement,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.3"
    );

    // Animate profile image with enhanced effects
    tl.fromTo(this.profileImage.nativeElement,
      { opacity: 0, scale: 0.8, rotationY: -15 },
      {
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 1.2,
        ease: "back.out(1.7)"
      },
      "-=0.6"
    );

    // Animate cube container
    tl.fromTo(this.cubeContainer.nativeElement,
      { opacity: 0, scale: 0.7, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        ease: "back.out(1.7)"
      },
      "-=0.4"
    );
  }

  private initThreeJsCube(): void {
    this.threejsCubeService.initCube(this.cubeContainer, (technology: string) => {
      this.openTechnologyModal(technology);
    });
  }

  private initTypewriterEffect(): void {
    if (!this.typewriterText || !this.cursor) return;

    // Reset typewriter text and state
    this.typewriterText.nativeElement.textContent = '';
    this.typewriterIndex = 0;
    this.isTyping = true;

    // Start continuous cursor blinking animation
    gsap.to(this.cursor.nativeElement, {
      opacity: 0,
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Start continuous typewriter cycle
    this.startTypewriterCycle();
  }

  private startTypewriterCycle(): void {
    this.typewriterCycle();
  }

  private typewriterCycle(): void {
    if (this.isTyping) {
      // Typing phase
      if (this.typewriterIndex < this.typewriterTextContent.length) {
        this.typewriterText.nativeElement.textContent += this.typewriterTextContent.charAt(this.typewriterIndex);
        this.typewriterIndex++;
        this.typewriterTimeout = setTimeout(() => this.typewriterCycle(), this.typewriterSpeed);
      } else {
        // Finished typing, pause before erasing
        this.typewriterTimeout = setTimeout(() => {
          this.isTyping = false;
          this.typewriterCycle();
        }, this.pauseBeforeErase);
      }
    } else {
      // Erasing phase
      if (this.typewriterIndex > 0) {
        this.typewriterIndex--;
        this.typewriterText.nativeElement.textContent = this.typewriterTextContent.substring(0, this.typewriterIndex);
        this.typewriterTimeout = setTimeout(() => this.typewriterCycle(), this.eraseSpeed);
      } else {
        // Finished erasing, pause before typing again
        this.typewriterTimeout = setTimeout(() => {
          this.isTyping = true;
          this.typewriterCycle();
        }, this.pauseBeforeType);
      }
    }
  }

  private initFloatingElements(): void {
    // Animate floating elements around profile image
    const floatingElements = this.profileImage.nativeElement.querySelectorAll('.floating-element');

    floatingElements.forEach((element: HTMLElement, index: number) => {
      gsap.to(element, {
        y: "random(-20, 20)",
        x: "random(-15, 15)",
        rotation: "random(-10, 10)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.5
      });
    });

    // Add gentle floating animation to profile image
    gsap.to(this.profileImage.nativeElement, {
      y: -10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  private initSocialAnimations(): void {
    // Enhanced social icons animation
    const socialIconElements = this.socialIcons.nativeElement.querySelectorAll('.social-icon');

    socialIconElements.forEach((icon: HTMLElement, index: number) => {
      // Entrance animation with stagger
      gsap.fromTo(icon,
        {
          opacity: 0,
          scale: 0.5,
          rotation: -180
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          delay: 2.5 + (index * 0.1),
          ease: "back.out(1.7)"
        }
      );

      // Enhanced hover effects
      icon.addEventListener('mouseenter', () => {
        gsap.to(icon, {
          scale: 1.3,
          rotation: 10,
          duration: 0.3,
          ease: "back.out(1.7)"
        });
      });

      icon.addEventListener('mouseleave', () => {
        gsap.to(icon, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "back.out(1.7)"
        });
      });
    });
  }

  getSocialIconTransform(index: number): string {
    // Calculate semi-circular positioning for social icons
    const totalIcons = this.socialLinks.length;
    const angleStep = 180 / (totalIcons - 1); // Spread across 180 degrees
    const angle = (index * angleStep - 90) * (Math.PI / 180); // Convert to radians
    const radius = 210; // Distance from center

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    return `translate(${x}px, ${y}px)`;
  }

  onImageError(event: Event): void {
    console.log('Profile image failed to load, using fallback');
    const img = event.target as HTMLImageElement;

    // Create a fallback SVG with COMPLETELY transparent background
    const fallbackSvg = `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="500" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
        <!-- NO background rectangle - completely transparent -->
        <!-- Simple figure outline only -->
        <ellipse cx="200" cy="150" rx="60" ry="80" fill="#26A69A" opacity="0.8"/>
        <rect x="140" y="220" width="120" height="200" rx="20" fill="#26A69A" opacity="0.8"/>
        <circle cx="180" cy="130" r="8" fill="#2C3E50"/>
        <circle cx="220" cy="130" r="8" fill="#2C3E50"/>
        <path d="M 180 150 Q 200 160 220 150" stroke="#2C3E50" stroke-width="2" fill="none"/>
        <text x="200" y="450" text-anchor="middle" font-family="Inter" font-size="12" fill="#26A69A" opacity="0.6">Fallback Portrait</text>
      </svg>
    `)}`;

    img.src = fallbackSvg;
  }

  onImageLoad(event: Event): void {
    console.log('Profile image loaded successfully');
    const img = event.target as HTMLImageElement;

    // Add loaded class for additional styling if needed
    img.classList.add('loaded');

    // Trigger any additional animations after image loads
    gsap.fromTo(img,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
    );
  }



  openTechnologyModal(technology: string): void {
    // Performance monitoring for modal opening
    this.performanceMonitor.markFeatureUsage(`modal-${technology}`);

    const data = this.technologyData[technology];
    if (data) {
      const dialogRef = this.dialog.open(TechnologyModalComponent, {
        width: '800px',
        maxWidth: '90vw',
        data: data,
        panelClass: 'technology-modal',
        // Performance optimization: Disable animations for faster opening
        disableClose: false,
        hasBackdrop: true,
        backdropClass: 'modal-backdrop'
      });

      dialogRef.afterClosed().subscribe(() => {
        this.performanceMonitor.measureFeatureUsage(`modal-${technology}`);
      });
    } else {
      // If exact match not found, try to find a partial match
      const availableKeys = Object.keys(this.technologyData);
      const matchingKey = availableKeys.find(key =>
        key.toLowerCase().includes(technology.toLowerCase()) ||
        technology.toLowerCase().includes(key.toLowerCase())
      );

      if (matchingKey) {
        const matchedData = this.technologyData[matchingKey];
        const dialogRef = this.dialog.open(TechnologyModalComponent, {
          width: '800px',
          maxWidth: '90vw',
          data: matchedData,
          panelClass: 'technology-modal',
          disableClose: false,
          hasBackdrop: true,
          backdropClass: 'modal-backdrop'
        });

        dialogRef.afterClosed().subscribe(() => {
          this.performanceMonitor.measureFeatureUsage(`modal-${matchingKey}`);
        });
      }
    }
  }

}

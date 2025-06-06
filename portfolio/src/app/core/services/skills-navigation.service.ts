import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

export interface Skill {
  readonly name: string;
  readonly category: 'frontend' | 'backend' | 'tools' | 'visualization' | '3d' | 'animation';
  readonly proficiency: 'expert' | 'advanced' | 'intermediate';
  readonly highlighted?: boolean;
}

export interface ProjectSkillMapping {
  readonly skillName: string;
  readonly projectIds: readonly string[];
  readonly projectNames: readonly string[];
}

@Injectable({
  providedIn: 'root'
})
export class SkillsNavigationService {
  private highlightedSkillSubject = new BehaviorSubject<string | null>(null);
  public highlightedSkill$ = this.highlightedSkillSubject.asObservable();
  private isNavigating$ = new BehaviorSubject<boolean>(false);

  // Skills that are used in projects and should navigate to projects section
  private readonly projectSkillMappings: readonly ProjectSkillMapping[] = [
    {
      skillName: 'Angular',
      projectIds: ['celeste', 'iot-dashboard', 'ico-sphere'],
      projectNames: ['Celeste (Greenko)', 'IOT Dashboard', 'ICO Sphere']
    },
    {
      skillName: 'Three.js',
      projectIds: ['ico-sphere'],
      projectNames: ['ICO Sphere']
    },
    {
      skillName: 'TypeScript',
      projectIds: ['celeste', 'iot-dashboard', 'ico-sphere'],
      projectNames: ['Celeste (Greenko)', 'IOT Dashboard', 'ICO Sphere']
    },
    {
      skillName: 'JavaScript',
      projectIds: ['celeste', 'iot-dashboard', 'ico-sphere', 'nh-cam'],
      projectNames: ['Celeste (Greenko)', 'IOT Dashboard', 'ICO Sphere', 'NH Cam']
    },
    {
      skillName: 'Node.js',
      projectIds: ['iot-dashboard', 'nh-cam'],
      projectNames: ['IOT Dashboard', 'NH Cam']
    },
    {
      skillName: 'Micro Frontends',
      projectIds: ['celeste', 'iot-dashboard'],
      projectNames: ['Celeste (Greenko)', 'IOT Dashboard']
    },
    {
      skillName: 'RxJS',
      projectIds: ['celeste', 'iot-dashboard'],
      projectNames: ['Celeste (Greenko)', 'IOT Dashboard']
    }
  ];

  // Comprehensive skills mapping for project technologies
  private readonly skillsMap: ReadonlyMap<string, Skill> = new Map([
    ['Angular', { name: 'Angular', category: 'frontend', proficiency: 'expert' }],
    ['TypeScript', { name: 'TypeScript', category: 'frontend', proficiency: 'expert' }],
    ['RxJS', { name: 'RxJS', category: 'frontend', proficiency: 'expert' }],
    ['JavaScript', { name: 'JavaScript', category: 'frontend', proficiency: 'expert' }],
    ['Three.js', { name: 'Three.js', category: '3d', proficiency: 'advanced' }],
    ['GSAP', { name: 'GSAP', category: 'animation', proficiency: 'advanced' }],
    ['Highcharts', { name: 'Highcharts', category: 'visualization', proficiency: 'expert' }],
    ['AG-Grid', { name: 'AG-Grid', category: 'tools', proficiency: 'advanced' }],
    ['Material Design', { name: 'Material Design', category: 'frontend', proficiency: 'advanced' }],
    ['Azure', { name: 'Azure', category: 'backend', proficiency: 'intermediate' }],
    ['WebGL', { name: 'WebGL', category: '3d', proficiency: 'advanced' }],
    ['WebSocket', { name: 'WebSocket', category: 'backend', proficiency: 'advanced' }],
    ['WebRTC', { name: 'WebRTC', category: 'backend', proficiency: 'intermediate' }],
    ['D3.js', { name: 'D3.js', category: 'visualization', proficiency: 'advanced' }],
    ['Socket.io', { name: 'Socket.io', category: 'backend', proficiency: 'advanced' }],
    ['OpenCV.js', { name: 'OpenCV.js', category: 'tools', proficiency: 'intermediate' }],
    ['FFmpeg', { name: 'FFmpeg', category: 'tools', proficiency: 'intermediate' }],
    ['Cannon.js', { name: 'Cannon.js', category: '3d', proficiency: 'intermediate' }],
    ['Chart.js', { name: 'Chart.js', category: 'visualization', proficiency: 'advanced' }],
    ['Bootstrap', { name: 'Bootstrap', category: 'frontend', proficiency: 'advanced' }],
    ['SASS', { name: 'SASS', category: 'frontend', proficiency: 'expert' }],
    ['jQuery', { name: 'jQuery', category: 'frontend', proficiency: 'advanced' }],
    ['PHP', { name: 'PHP', category: 'backend', proficiency: 'intermediate' }],
    ['MySQL', { name: 'MySQL', category: 'backend', proficiency: 'intermediate' }],
    ['Node.js', { name: 'Node.js', category: 'backend', proficiency: 'advanced' }],
    ['MongoDB', { name: 'MongoDB', category: 'backend', proficiency: 'intermediate' }],
    ['Express', { name: 'Express', category: 'backend', proficiency: 'advanced' }],
    ['JWT', { name: 'JWT', category: 'backend', proficiency: 'advanced' }],
    ['REST APIs', { name: 'REST APIs', category: 'backend', proficiency: 'expert' }],
    ['Git', { name: 'Git', category: 'tools', proficiency: 'expert' }],
    ['Micro Frontends', { name: 'Micro Frontends', category: 'frontend', proficiency: 'expert' }]
  ]);

  constructor(
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {
    // Register GSAP ScrollToPlugin for performance
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(ScrollToPlugin);
    }
  }

  /**
   * Navigate to skills section and highlight specific skill
   * @param skillName - Name of the skill to highlight
   * @param sourceRoute - Current route for optimized navigation
   */
  async navigateToSkill(skillName: string, sourceRoute?: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const skill = this.skillsMap.get(skillName);
    if (!skill) {
      console.warn(`Skill "${skillName}" not found in skills map`);
      return;
    }

    // Set highlighted skill
    this.highlightedSkillSubject.next(skillName);

    try {
      // Determine optimal navigation strategy
      const currentUrl = this.router.url;
      const isOnAboutPage = currentUrl.includes('/about');
      
      if (isOnAboutPage) {
        // Already on about page, just scroll to skills
        await this.scrollToSkillsSection();
      } else {
        // Navigate to about page first, then scroll
        await this.router.navigate(['/about'], { 
          fragment: 'skills',
          queryParams: { highlight: skillName },
          queryParamsHandling: 'merge'
        });
        
        // Wait for navigation to complete
        setTimeout(() => {
          this.scrollToSkillsSection();
        }, 100);
      }

      // Highlight the specific skill after navigation
      setTimeout(() => {
        this.highlightSkillElement(skillName);
      }, 300);

    } catch (error) {
      console.error('Error navigating to skill:', error);
    }
  }

  /**
   * Scroll to skills section with smooth animation
   */
  private async scrollToSkillsSection(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const skillsSection = document.querySelector('.skills-highlight') || 
                         document.querySelector('#skills') ||
                         document.querySelector('[aria-labelledby="skills-title"]');

    if (skillsSection) {
      // Use optimized scroll with performance considerations
      skillsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });

      // Add visual feedback for scroll completion
      return new Promise((resolve) => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              observer.disconnect();
              resolve();
            }
          });
        }, { threshold: 0.5 });

        observer.observe(skillsSection);
        
        // Fallback timeout
        setTimeout(() => {
          observer.disconnect();
          resolve();
        }, 2000);
      });
    }
  }

  /**
   * Highlight specific skill element with animation
   * @param skillName - Name of the skill to highlight
   */
  private highlightSkillElement(skillName: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Find skill element by text content
    const skillElements = Array.from(document.querySelectorAll('.skill-tag'));
    const targetSkill = skillElements.find(el => 
      el.textContent?.trim().toLowerCase() === skillName.toLowerCase()
    ) as HTMLElement;

    if (targetSkill) {
      // Remove previous highlights
      skillElements.forEach(el => {
        el.classList.remove('highlighted');
        gsap.killTweensOf(el);
      });

      // Add highlight class for CSS styling
      targetSkill.classList.add('highlighted');

      // GSAP animation for highlighting
      const timeline = gsap.timeline();
      
      timeline
        .to(targetSkill, {
          scale: 1.2,
          duration: 0.3,
          ease: 'power2.out',
          force3D: true
        })
        .to(targetSkill, {
          backgroundColor: '#FFD700',
          color: '#1A1A1A',
          duration: 0.2,
          ease: 'power2.out'
        })
        .to(targetSkill, {
          scale: 1.1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        })
        .to(targetSkill, {
          backgroundColor: 'var(--secondary-color)',
          color: 'white',
          duration: 0.3,
          ease: 'power2.out',
          delay: 1
        })
        .to(targetSkill, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => {
            targetSkill.classList.remove('highlighted');
            this.highlightedSkillSubject.next(null);
          }
        });

      // Accessibility: Announce to screen readers
      this.announceSkillHighlight(skillName);
    }
  }

  /**
   * Announce skill highlight to screen readers
   * @param skillName - Name of the highlighted skill
   */
  private announceSkillHighlight(skillName: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Highlighting skill: ${skillName}`;
    
    document.body.appendChild(announcement);
    
    // Remove announcement after screen reader has time to read it
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Get skill information by name
   * @param skillName - Name of the skill
   * @returns Skill information or undefined
   */
  getSkillInfo(skillName: string): Skill | undefined {
    return this.skillsMap.get(skillName);
  }

  /**
   * Get all available skills
   * @returns Array of all skills
   */
  getAllSkills(): Skill[] {
    return Array.from(this.skillsMap.values());
  }

  /**
   * Get skills by category
   * @param category - Skill category
   * @returns Array of skills in the category
   */
  getSkillsByCategory(category: Skill['category']): Skill[] {
    return this.getAllSkills().filter(skill => skill.category === category);
  }

  /**
   * Check if a technology is a recognized skill
   * @param technology - Technology name to check
   * @returns True if technology is a recognized skill
   */
  isRecognizedSkill(technology: string): boolean {
    return this.skillsMap.has(technology);
  }

  /**
   * Clear current skill highlight
   */
  clearHighlight(): void {
    this.highlightedSkillSubject.next(null);
    
    if (isPlatformBrowser(this.platformId)) {
      const skillElements = document.querySelectorAll('.skill-tag.highlighted');
      skillElements.forEach(el => {
        el.classList.remove('highlighted');
        gsap.killTweensOf(el);
      });
    }
  }

  /**
   * Get currently highlighted skill
   * @returns Currently highlighted skill name or null
   */
  getCurrentHighlight(): string | null {
    return this.highlightedSkillSubject.value;
  }

  /**
   * Check if a skill has project references
   */
  hasProjectReference(skillName: string): boolean {
    return this.projectSkillMappings.some(mapping => mapping.skillName === skillName);
  }

  /**
   * Get project mappings for a skill
   */
  getProjectMappings(skillName: string): ProjectSkillMapping | null {
    return this.projectSkillMappings.find(mapping => mapping.skillName === skillName) || null;
  }

  /**
   * Navigate to projects section and highlight relevant project cards
   */
  async navigateToProjects(skillName: string): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) return false;

    const mapping = this.getProjectMappings(skillName);
    if (!mapping) {
      console.warn(`No project mapping found for skill: ${skillName}`);
      return false;
    }

    try {
      this.isNavigating$.next(true);

      // Navigate to projects page if not already there
      const currentUrl = this.router.url;
      if (!currentUrl.includes('/projects')) {
        await this.router.navigate(['/projects']);

        // Wait for navigation to complete
        await this.waitForNavigation();
      }

      // Scroll to projects section and highlight cards
      await this.scrollToProjectsSection();
      await this.highlightProjectCards(mapping.projectIds);

      // Set highlighted skill for visual feedback
      this.highlightedSkillSubject.next(skillName);

      // Clear highlight after 5 seconds
      setTimeout(() => {
        this.clearHighlight();
      }, 5000);

      console.log(`Navigated to projects for skill: ${skillName}`);
      return true;

    } catch (error) {
      console.error(`Error navigating to projects for skill ${skillName}:`, error);
      return false;
    } finally {
      this.isNavigating$.next(false);
    }
  }

  /**
   * Get navigation state observable
   */
  get isNavigating(): Observable<boolean> {
    return this.isNavigating$.asObservable();
  }

  /**
   * Get all skills that have project references
   */
  getProjectLinkedSkills(): readonly string[] {
    return this.projectSkillMappings.map(mapping => mapping.skillName);
  }

  /**
   * Wait for navigation to complete
   */
  private waitForNavigation(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, 100);
    });
  }

  /**
   * Scroll to projects section with smooth animation
   */
  private async scrollToProjectsSection(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    return new Promise(resolve => {
      const projectsSection = document.querySelector('.projects-section') ||
                             document.querySelector('[data-section="projects"]') ||
                             document.querySelector('app-projects') ||
                             document.body;

      if (projectsSection) {
        gsap.to(window, {
          duration: 1.5,
          scrollTo: {
            y: projectsSection,
            offsetY: 80
          },
          ease: 'power2.out',
          onComplete: resolve
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Highlight project cards with animation
   */
  private async highlightProjectCards(projectIds: readonly string[]): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    return new Promise(resolve => {
      setTimeout(() => {
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach((card, index) => {
          const cardId = card.getAttribute('data-project-id') ||
                        card.getAttribute('id') ||
                        card.querySelector('[data-project]')?.getAttribute('data-project');

          if (cardId && projectIds.includes(cardId)) {
            card.classList.add('skill-highlighted');

            gsap.fromTo(card,
              {
                scale: 1,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              },
              {
                scale: 1.02,
                boxShadow: '0 8px 25px rgba(38, 166, 154, 0.3)',
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power2.out',
                yoyo: true,
                repeat: 1
              }
            );
          }
        });

        setTimeout(() => {
          projectCards.forEach(card => {
            card.classList.remove('skill-highlighted');
          });
          resolve();
        }, 3000);
      }, 300);
    });
  }
}

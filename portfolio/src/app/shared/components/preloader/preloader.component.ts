import { Component, OnInit, OnDestroy, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ThemeService } from '../../../core/services/theme.service';
import { PerformanceMonitorService } from '../../../core/services/performance-monitor.service';

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="preloader-overlay"
         #preloaderOverlay
         [class.hidden]="isHidden"
         role="status"
         aria-live="polite"
         aria-label="Loading application">
      <div class="preloader-content" #preloaderContent>
        <!-- Primary Chart Animation -->
        <div class="chart-animation-container" #chartContainer>
          <!-- Spinning Chart Visualization -->
          <div class="chart-visualization">
            <!-- Pie Chart Segments -->
            <div class="pie-chart">
              <div class="pie-segment segment-1" style="--rotation: 0deg; --color: var(--secondary-color);"></div>
              <div class="pie-segment segment-2" style="--rotation: 72deg; --color: #4db6ac;"></div>
              <div class="pie-segment segment-3" style="--rotation: 144deg; --color: #80cbc4;"></div>
              <div class="pie-segment segment-4" style="--rotation: 216deg; --color: #b2dfdb;"></div>
              <div class="pie-segment segment-5" style="--rotation: 288deg; --color: #e0f2f1;"></div>
            </div>

            <!-- Bar Chart Animation -->
            <div class="bar-chart">
              <div class="chart-bar" style="--delay: 0s; --height: 60%;"></div>
              <div class="chart-bar" style="--delay: 0.1s; --height: 80%;"></div>
              <div class="chart-bar" style="--delay: 0.2s; --height: 45%;"></div>
              <div class="chart-bar" style="--delay: 0.3s; --height: 90%;"></div>
              <div class="chart-bar" style="--delay: 0.4s; --height: 70%;"></div>
            </div>

            <!-- Center Icon -->
            <div class="chart-center">
              <div class="chart-icon">📊</div>
            </div>
          </div>
        </div>

        <!-- Lottie Animation (Secondary) -->
        <div class="lottie-container" #lottieContainer style="display: none;">
          <lottie-player
            #lottiePlayer
            background="transparent"
            speed="1.2"
            style="width: 120px; height: 120px;"
            loop
            autoplay
            renderer="svg">
          </lottie-player>
        </div>
        
        <!-- Loading text -->
        <div class="loading-text" #loadingText aria-label="Loading">
          <span class="loading-letter"
                *ngFor="let letter of loadingLetters; let i = index"
                [style.animation-delay]="(i * 0.1) + 's'"
                aria-hidden="true">
            {{ letter }}
          </span>
        </div>
        
        <!-- Progress indicator -->
        <div class="progress-container" #progressContainer>
          <div class="progress-bar" #progressBar></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .preloader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      transition: opacity 0.5s ease-out, visibility 0.5s ease-out;
    }
    
    .preloader-overlay.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    
    .preloader-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }
    
    .chart-animation-container {
      position: relative;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(38, 166, 154, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 30px rgba(38, 166, 154, 0.3);
      overflow: hidden;
    }

    .chart-animation-container::before {
      content: '';
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      border-radius: 50%;
      border: 2px solid var(--secondary-color);
      opacity: 0.6;
      animation: pulse 2s ease-in-out infinite;
    }

    .chart-visualization {
      position: relative;
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pie-chart {
      position: absolute;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      animation: rotate 3s linear infinite;
    }

    .pie-segment {
      position: absolute;
      width: 50%;
      height: 50%;
      transform-origin: 100% 100%;
      transform: rotate(var(--rotation));
    }

    .pie-segment::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: var(--color);
      border-radius: 100% 0 0 0;
      opacity: 0.8;
      animation: segmentPulse 2s ease-in-out infinite;
      animation-delay: calc(var(--rotation) / 72deg * 0.2s);
    }

    .bar-chart {
      position: absolute;
      display: flex;
      align-items: end;
      gap: 3px;
      height: 40px;
      opacity: 0.7;
    }

    .chart-bar {
      width: 4px;
      background: var(--secondary-color);
      border-radius: 2px 2px 0 0;
      height: var(--height);
      animation: chartBounce 1.5s ease-in-out infinite;
      animation-delay: var(--delay);
    }

    .chart-center {
      position: absolute;
      width: 30px;
      height: 30px;
      background: var(--primary-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--secondary-color);
      z-index: 2;
    }

    .chart-icon {
      font-size: 16px;
      animation: iconBounce 2s ease-in-out infinite;
    }

    .lottie-container {
      position: relative;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(38, 166, 154, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 30px rgba(38, 166, 154, 0.3);
    }
    
    .loading-text {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--text-color);
      letter-spacing: 0.2em;
      text-transform: uppercase;
    }
    
    .loading-letter {
      display: inline-block;
      animation: letterBounce 1.5s ease-in-out infinite;
    }
    
    .progress-container {
      width: 200px;
      height: 3px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      overflow: hidden;
    }
    
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--secondary-color), #4db6ac);
      border-radius: 2px;
      width: 0%;
      transition: width 0.3s ease;
    }
    
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 0.6;
      }
      50% {
        transform: scale(1.1);
        opacity: 0.8;
      }
    }

    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes segmentPulse {
      0%, 100% {
        opacity: 0.6;
        transform: scale(1);
      }
      50% {
        opacity: 1;
        transform: scale(1.1);
      }
    }

    @keyframes chartBounce {
      0%, 100% {
        transform: scaleY(0.7);
        opacity: 0.7;
      }
      50% {
        transform: scaleY(1);
        opacity: 1;
      }
    }

    @keyframes iconBounce {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.2);
      }
    }

    @keyframes letterBounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
      .chart-animation-container,
      .lottie-container {
        width: 80px;
        height: 80px;
      }

      .chart-visualization {
        width: 70px;
        height: 70px;
      }

      .pie-chart {
        width: 60px;
        height: 60px;
      }

      .bar-chart {
        height: 30px;
      }

      .chart-center {
        width: 20px;
        height: 20px;
      }

      .chart-icon {
        font-size: 12px;
      }

      .loading-text {
        font-size: 1rem;
      }

      .progress-container {
        width: 150px;
      }
    }
    
    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      .preloader-overlay,
      .chart-animation-container::before,
      .pie-chart,
      .pie-segment::before,
      .chart-bar,
      .chart-icon,
      .loading-letter {
        animation: none;
      }

      .progress-bar {
        transition: none;
      }

      .pie-chart {
        transform: none;
      }
    }
  `]
})
export class PreloaderComponent implements OnInit, OnDestroy {
  @ViewChild('preloaderOverlay') preloaderOverlay!: ElementRef;
  @ViewChild('preloaderContent') preloaderContent!: ElementRef;
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @ViewChild('lottieContainer') lottieContainer!: ElementRef;
  @ViewChild('lottiePlayer') lottiePlayer!: ElementRef;
  @ViewChild('loadingText') loadingText!: ElementRef;
  @ViewChild('progressBar') progressBar!: ElementRef;

  isHidden = false;
  loadingLetters = ['L', 'O', 'A', 'D', 'I', 'N', 'G'];
  private progressInterval?: number;
  private hideTimeout?: number;
  private startTime = performance.now();
  private performanceMeasure?: () => void;

  constructor(
    private themeService: ThemeService,
    private performanceMonitor: PerformanceMonitorService
  ) {}

  ngOnInit(): void {
    // Start performance monitoring
    this.performanceMeasure = this.performanceMonitor.measureComponentLoad('PreloaderComponent');
    this.performanceMonitor.markFeatureUsage('preloader-start');

    this.startPreloader();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private startPreloader(): void {
    // Start progress animation
    this.animateProgress();

    // Add entrance animation for chart
    this.animateChartEntrance();

    // Hide preloader after 2 seconds
    this.hideTimeout = window.setTimeout(() => {
      this.hidePreloader();
    }, 2000);
  }

  private animateChartEntrance(): void {
    if (this.chartContainer) {
      // GSAP entrance animation for the chart
      gsap.fromTo(this.chartContainer.nativeElement,
        {
          scale: 0,
          opacity: 0,
          rotation: -180
        },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 0.2
        }
      );
    }
  }

  private animateProgress(): void {
    let progress = 0;
    this.progressInterval = window.setInterval(() => {
      progress += Math.random() * 15 + 5; // Random increment between 5-20%
      progress = Math.min(progress, 100);
      
      if (this.progressBar) {
        this.progressBar.nativeElement.style.width = `${progress}%`;
      }
      
      if (progress >= 100) {
        clearInterval(this.progressInterval);
      }
    }, 100);
  }

  private hidePreloader(): void {
    if (!this.preloaderOverlay || !this.preloaderContent) return;

    // Performance monitoring
    const totalTime = performance.now() - this.startTime;
    console.log(`🚀 Preloader total time: ${totalTime.toFixed(2)}ms`);

    this.performanceMonitor.measureFeatureUsage('preloader-start');
    if (this.performanceMeasure) {
      this.performanceMeasure();
    }

    // GSAP fade-out animation
    const tl = gsap.timeline({
      onComplete: () => {
        this.isHidden = true;
        // Emit event to notify app that preloader is hidden
        document.dispatchEvent(new CustomEvent('preloaderHidden', {
          detail: { totalTime }
        }));
      }
    });

    // Animate content out
    tl.to(this.preloaderContent.nativeElement, {
      scale: 0.8,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in"
    });

    // Animate overlay out
    tl.to(this.preloaderOverlay.nativeElement, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out"
    }, "-=0.2");
  }

  private cleanup(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }
}

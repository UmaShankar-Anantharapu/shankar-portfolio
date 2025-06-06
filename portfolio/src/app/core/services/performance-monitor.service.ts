import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PerformanceMonitorService {
  private performanceObserver?: PerformanceObserver;
  private memoryCheckInterval?: number;

  constructor() {
    this.initPerformanceMonitoring();
  }

  private initPerformanceMonitoring(): void {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.logPerformanceMetric(entry);
        }
      });

      // Monitor different types of performance entries
      try {
        this.performanceObserver.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
      } catch (e) {
        console.warn('Performance monitoring not fully supported');
      }
    }

    // Monitor memory usage
    this.startMemoryMonitoring();
  }

  private logPerformanceMetric(entry: PerformanceEntry): void {
    if (entry.entryType === 'navigation') {
      const navEntry = entry as PerformanceNavigationTiming;
      console.log('Navigation Performance:', {
        domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
        loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
        firstPaint: this.getFirstPaint(),
        firstContentfulPaint: this.getFirstContentfulPaint()
      });
    }
  }

  private getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : 0;
  }

  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return firstContentfulPaint ? firstContentfulPaint.startTime : 0;
  }

  private startMemoryMonitoring(): void {
    // Check memory usage every 30 seconds
    this.memoryCheckInterval = window.setInterval(() => {
      this.checkMemoryUsage();
    }, 30000);
  }

  private checkMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryInfo = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      };

      // Log warning if memory usage is high
      if (memoryInfo.usagePercentage > 80) {
        console.warn('High memory usage detected:', memoryInfo);
      }

      // Log memory info in development
      if (!environment.production) {
        console.log('Memory Usage:', memoryInfo);
      }
    }
  }

  measureComponentLoad(componentName: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      console.log(`${componentName} load time: ${loadTime.toFixed(2)}ms`);
      
      // Log warning for slow components
      if (loadTime > 100) {
        console.warn(`Slow component detected: ${componentName} took ${loadTime.toFixed(2)}ms`);
      }
    };
  }

  markFeatureUsage(featureName: string): void {
    performance.mark(`feature-${featureName}-start`);
  }

  measureFeatureUsage(featureName: string): void {
    const markName = `feature-${featureName}-start`;
    const measureName = `feature-${featureName}-duration`;
    
    try {
      performance.measure(measureName, markName);
      const measure = performance.getEntriesByName(measureName)[0];
      console.log(`Feature ${featureName} usage time: ${measure.duration.toFixed(2)}ms`);
    } catch (e) {
      console.warn(`Could not measure feature ${featureName}`);
    }
  }

  destroy(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
    }
  }
}

// Environment placeholder - in real app this would be imported
const environment = { production: false };

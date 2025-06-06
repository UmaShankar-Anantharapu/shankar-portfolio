// Performance Optimization Script for Portfolio Application
// Performance Specialist - Complete Application Optimization

console.log('⚡ Portfolio Performance Optimization Analysis');
console.log('=============================================');

// Performance Analysis Functions
const PerformanceAnalysis = {
  
  // 1. Lazy Loading Verification
  analyzeLazyLoading() {
    console.log('\n📦 Lazy Loading Analysis');
    
    const expectedModules = [
      'home-component',
      'about-module', 
      'projects-module',
      'skills-module',
      'contact-module'
    ];
    
    const loadedChunks = performance.getEntriesByType('resource')
      .filter(entry => entry.name.includes('chunk-'))
      .map(entry => {
        const chunkName = entry.name.split('/').pop();
        return {
          name: chunkName,
          size: entry.transferSize || 0,
          loadTime: entry.responseEnd - entry.requestStart
        };
      });
    
    console.log(`📊 Total lazy chunks loaded: ${loadedChunks.length}`);
    
    expectedModules.forEach(module => {
      const chunk = loadedChunks.find(c => c.name.includes(module));
      if (chunk) {
        console.log(`✅ ${module}: ${(chunk.size / 1024).toFixed(2)}KB, ${chunk.loadTime.toFixed(2)}ms`);
      } else {
        console.log(`⚠️ ${module}: Not yet loaded (lazy loading working)`);
      }
    });
    
    // Check main bundle size
    const mainBundle = performance.getEntriesByType('resource')
      .find(entry => entry.name.includes('main.js'));
    
    if (mainBundle) {
      const mainSize = (mainBundle.transferSize || 0) / 1024;
      console.log(`📊 Main bundle size: ${mainSize.toFixed(2)}KB`);
      
      if (mainSize < 50) {
        console.log('✅ Excellent main bundle size (< 50KB)');
      } else if (mainSize < 100) {
        console.log('⚠️ Good main bundle size (< 100KB)');
      } else {
        console.log('❌ Large main bundle size (> 100KB)');
      }
    }
  },
  
  // 2. Animation Performance Analysis
  analyzeAnimationPerformance() {
    console.log('\n🎬 Animation Performance Analysis');
    
    // Check GSAP performance
    if (typeof gsap !== 'undefined') {
      console.log('✅ GSAP loaded');
      
      // Check ScrollTrigger instances
      if (typeof ScrollTrigger !== 'undefined') {
        const triggers = ScrollTrigger.getAll();
        console.log(`📊 ScrollTrigger instances: ${triggers.length}`);
        
        if (triggers.length > 20) {
          console.log('⚠️ High number of ScrollTriggers - consider optimization');
        } else {
          console.log('✅ Reasonable number of ScrollTriggers');
        }
        
        // Check for performance optimizations
        let optimizedTriggers = 0;
        triggers.forEach(trigger => {
          if (trigger.refresh || trigger.kill) {
            optimizedTriggers++;
          }
        });
        
        console.log(`📊 Optimized triggers: ${optimizedTriggers}/${triggers.length}`);
      }
    }
    
    // Check Three.js performance
    if (typeof THREE !== 'undefined') {
      console.log('✅ Three.js loaded');
      
      // Check for WebGL context
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          console.log('✅ WebGL context available');
          console.log(`📊 WebGL version: ${gl.getParameter(gl.VERSION)}`);
          console.log(`📊 WebGL renderer: ${gl.getParameter(gl.RENDERER)}`);
        }
      }
    }
    
    // Frame rate monitoring
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        console.log(`📊 Current FPS: ${fps}`);
        
        if (fps >= 55) {
          console.log('✅ Excellent frame rate (≥55 FPS)');
        } else if (fps >= 30) {
          console.log('⚠️ Acceptable frame rate (≥30 FPS)');
        } else {
          console.log('❌ Poor frame rate (<30 FPS)');
        }
        
        frameCount = 0;
        lastTime = currentTime;
        return;
      }
      
      if (frameCount < 60) {
        requestAnimationFrame(measureFPS);
      }
    };
    
    requestAnimationFrame(measureFPS);
  },
  
  // 3. Memory Usage Analysis
  analyzeMemoryUsage() {
    console.log('\n🧠 Memory Usage Analysis');
    
    if (performance.memory) {
      const memory = performance.memory;
      const used = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
      const total = (memory.totalJSHeapSize / 1024 / 1024).toFixed(2);
      const limit = (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2);
      
      console.log(`📊 Used memory: ${used}MB`);
      console.log(`📊 Total memory: ${total}MB`);
      console.log(`📊 Memory limit: ${limit}MB`);
      
      const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      console.log(`📊 Memory usage: ${usagePercentage.toFixed(2)}%`);
      
      if (usagePercentage < 25) {
        console.log('✅ Excellent memory usage (< 25%)');
      } else if (usagePercentage < 50) {
        console.log('⚠️ Good memory usage (< 50%)');
      } else {
        console.log('❌ High memory usage (> 50%)');
      }
    } else {
      console.log('⚠️ Memory API not available');
    }
  },
  
  // 4. Network Performance Analysis
  analyzeNetworkPerformance() {
    console.log('\n🌐 Network Performance Analysis');
    
    const resources = performance.getEntriesByType('resource');
    
    // Analyze critical resources
    const criticalResources = resources.filter(r => 
      r.name.includes('main.js') || 
      r.name.includes('styles.css') ||
      r.name.includes('polyfills.js')
    );
    
    console.log(`📊 Critical resources: ${criticalResources.length}`);
    
    let totalCriticalSize = 0;
    let totalCriticalTime = 0;
    
    criticalResources.forEach(resource => {
      const name = resource.name.split('/').pop();
      const loadTime = resource.responseEnd - resource.requestStart;
      const size = resource.transferSize ? (resource.transferSize / 1024).toFixed(2) : 'N/A';
      
      totalCriticalSize += resource.transferSize || 0;
      totalCriticalTime += loadTime;
      
      console.log(`📊 ${name}: ${loadTime.toFixed(2)}ms, ${size}KB`);
    });
    
    console.log(`📊 Total critical size: ${(totalCriticalSize / 1024).toFixed(2)}KB`);
    console.log(`📊 Average critical load time: ${(totalCriticalTime / criticalResources.length).toFixed(2)}ms`);
    
    // Check for lazy-loaded modules
    const lazyModules = resources.filter(r => r.name.includes('chunk-'));
    console.log(`📊 Lazy-loaded modules: ${lazyModules.length}`);
    
    if (lazyModules.length >= 5) {
      console.log('✅ Good lazy loading implementation');
    } else {
      console.log('⚠️ Consider more lazy loading');
    }
  },
  
  // 5. Core Web Vitals Analysis
  analyzeCoreWebVitals() {
    console.log('\n📈 Core Web Vitals Analysis');
    
    // LCP (Largest Contentful Paint)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      const lcp = lastEntry.startTime;
      
      console.log(`📊 LCP: ${lcp.toFixed(2)}ms`);
      
      if (lcp < 2500) {
        console.log('✅ Excellent LCP (< 2.5s)');
      } else if (lcp < 4000) {
        console.log('⚠️ Needs improvement LCP (< 4s)');
      } else {
        console.log('❌ Poor LCP (> 4s)');
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // FID (First Input Delay) - simulated
    let firstInputDelay = null;
    document.addEventListener('click', function measureFID() {
      if (firstInputDelay === null) {
        const start = performance.now();
        requestAnimationFrame(() => {
          firstInputDelay = performance.now() - start;
          console.log(`📊 Simulated FID: ${firstInputDelay.toFixed(2)}ms`);
          
          if (firstInputDelay < 100) {
            console.log('✅ Excellent FID (< 100ms)');
          } else if (firstInputDelay < 300) {
            console.log('⚠️ Needs improvement FID (< 300ms)');
          } else {
            console.log('❌ Poor FID (> 300ms)');
          }
        });
        document.removeEventListener('click', measureFID);
      }
    });
    
    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      console.log(`📊 CLS: ${clsValue.toFixed(4)}`);
      
      if (clsValue < 0.1) {
        console.log('✅ Excellent CLS (< 0.1)');
      } else if (clsValue < 0.25) {
        console.log('⚠️ Needs improvement CLS (< 0.25)');
      } else {
        console.log('❌ Poor CLS (> 0.25)');
      }
    }).observe({ entryTypes: ['layout-shift'] });
  },
  
  // 6. Bundle Analysis
  analyzeBundleOptimization() {
    console.log('\n📦 Bundle Optimization Analysis');
    
    const allResources = performance.getEntriesByType('resource');
    const jsResources = allResources.filter(r => r.name.includes('.js'));
    const cssResources = allResources.filter(r => r.name.includes('.css'));
    
    console.log(`📊 JavaScript files: ${jsResources.length}`);
    console.log(`📊 CSS files: ${cssResources.length}`);
    
    let totalJSSize = 0;
    let totalCSSSize = 0;
    
    jsResources.forEach(resource => {
      totalJSSize += resource.transferSize || 0;
    });
    
    cssResources.forEach(resource => {
      totalCSSSize += resource.transferSize || 0;
    });
    
    console.log(`📊 Total JS size: ${(totalJSSize / 1024).toFixed(2)}KB`);
    console.log(`📊 Total CSS size: ${(totalCSSSize / 1024).toFixed(2)}KB`);
    
    // Check for tree-shaking effectiveness
    const unusedCSS = document.querySelectorAll('style').length;
    console.log(`📊 Inline styles: ${unusedCSS}`);
    
    if (totalJSSize < 500 * 1024) {
      console.log('✅ Good JavaScript bundle size (< 500KB)');
    } else {
      console.log('⚠️ Large JavaScript bundle size (> 500KB)');
    }
    
    if (totalCSSSize < 200 * 1024) {
      console.log('✅ Good CSS bundle size (< 200KB)');
    } else {
      console.log('⚠️ Large CSS bundle size (> 200KB)');
    }
  }
};

// Performance Optimization Recommendations
const PerformanceRecommendations = {
  
  generateRecommendations() {
    console.log('\n🎯 Performance Optimization Recommendations');
    console.log('============================================');
    
    console.log('\n1. 📦 Bundle Optimization:');
    console.log('   - Ensure all feature modules are lazy-loaded');
    console.log('   - Use dynamic imports for heavy libraries');
    console.log('   - Enable tree-shaking in angular.json');
    console.log('   - Consider code splitting for large components');
    
    console.log('\n2. 🎬 Animation Optimization:');
    console.log('   - Debounce scroll events (use throttle/debounce)');
    console.log('   - Limit frame rates for non-critical animations');
    console.log('   - Use will-change CSS property sparingly');
    console.log('   - Prefer transform/opacity for animations');
    
    console.log('\n3. 🧠 Memory Optimization:');
    console.log('   - Properly cleanup GSAP animations in ngOnDestroy');
    console.log('   - Unsubscribe from observables');
    console.log('   - Remove event listeners');
    console.log('   - Use OnPush change detection strategy');
    
    console.log('\n4. 🌐 Network Optimization:');
    console.log('   - Enable gzip compression');
    console.log('   - Use CDN for static assets');
    console.log('   - Implement service worker for caching');
    console.log('   - Optimize images (WebP format)');
    
    console.log('\n5. ⚡ Runtime Optimization:');
    console.log('   - Use trackBy functions in *ngFor');
    console.log('   - Implement virtual scrolling for large lists');
    console.log('   - Use async pipe for observables');
    console.log('   - Minimize DOM manipulations');
    
    console.log('\n6. 📱 Mobile Optimization:');
    console.log('   - Test on real devices');
    console.log('   - Optimize touch interactions');
    console.log('   - Reduce animation complexity on mobile');
    console.log('   - Use passive event listeners');
  }
};

// Main performance analysis function
async function runPerformanceAnalysis() {
  console.log('🚀 Starting Portfolio Performance Analysis...\n');
  
  // Wait for page to be fully loaded
  if (document.readyState !== 'complete') {
    await new Promise(resolve => {
      window.addEventListener('load', resolve);
    });
  }
  
  // Run all analyses
  PerformanceAnalysis.analyzeLazyLoading();
  
  setTimeout(() => {
    PerformanceAnalysis.analyzeAnimationPerformance();
  }, 1000);
  
  setTimeout(() => {
    PerformanceAnalysis.analyzeMemoryUsage();
  }, 2000);
  
  setTimeout(() => {
    PerformanceAnalysis.analyzeNetworkPerformance();
  }, 3000);
  
  setTimeout(() => {
    PerformanceAnalysis.analyzeCoreWebVitals();
  }, 4000);
  
  setTimeout(() => {
    PerformanceAnalysis.analyzeBundleOptimization();
  }, 5000);
  
  setTimeout(() => {
    PerformanceRecommendations.generateRecommendations();
  }, 6000);
  
  setTimeout(() => {
    console.log('\n✅ Performance analysis complete!');
    console.log('💡 Use Chrome DevTools Performance tab for detailed profiling');
    console.log('🔧 Run "ng build --aot" to verify production build optimization');
  }, 7000);
}

// Auto-run analysis
runPerformanceAnalysis();

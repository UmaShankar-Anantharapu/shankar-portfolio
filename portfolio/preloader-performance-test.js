// Preloader Performance Test Script for Chrome DevTools
// Run this in the browser console to test preloader performance

console.log('🎬 Starting Preloader Performance Test...');

// Test 1: Preloader Load Time
function testPreloaderLoadTime() {
  console.log('\n⏱️ Preloader Load Time Test:');
  
  // Listen for preloader events
  let preloaderStartTime = performance.now();
  let preloaderEndTime = null;
  
  document.addEventListener('preloaderHidden', (event) => {
    preloaderEndTime = performance.now();
    const totalTime = preloaderEndTime - preloaderStartTime;
    const detailTime = event.detail?.totalTime || totalTime;
    
    console.log(`✅ Preloader total duration: ${totalTime.toFixed(2)}ms`);
    console.log(`✅ Preloader internal timing: ${detailTime.toFixed(2)}ms`);
    
    // Performance benchmarks
    if (totalTime < 2500) {
      console.log('✅ Excellent: Preloader completed within expected time');
    } else if (totalTime < 3000) {
      console.log('⚠️ Good: Preloader slightly longer than expected');
    } else {
      console.log('❌ Poor: Preloader taking too long');
    }
  });
}

// Test 2: Animation Performance
function testAnimationPerformance() {
  console.log('\n🎨 Animation Performance Test:');
  
  let frameCount = 0;
  let lastTime = performance.now();
  let fpsReadings = [];
  
  function measureFPS() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
      const fps = frameCount;
      fpsReadings.push(fps);
      console.log(`📊 Current FPS: ${fps}`);
      
      frameCount = 0;
      lastTime = currentTime;
      
      // Stop after 5 seconds
      if (fpsReadings.length >= 5) {
        const avgFPS = fpsReadings.reduce((a, b) => a + b, 0) / fpsReadings.length;
        console.log(`✅ Average FPS: ${avgFPS.toFixed(1)}`);
        
        if (avgFPS >= 55) {
          console.log('✅ Excellent: Smooth 60 FPS animation');
        } else if (avgFPS >= 45) {
          console.log('⚠️ Good: Acceptable animation performance');
        } else {
          console.log('❌ Poor: Animation performance needs optimization');
        }
        return;
      }
    }
    
    requestAnimationFrame(measureFPS);
  }
  
  requestAnimationFrame(measureFPS);
}

// Test 3: Memory Usage During Preloader
function testMemoryUsage() {
  console.log('\n🧠 Memory Usage Test:');
  
  if (!('memory' in performance)) {
    console.log('❌ Memory API not available in this browser');
    return;
  }
  
  const initialMemory = performance.memory.usedJSHeapSize;
  console.log(`📊 Initial memory: ${(initialMemory / 1024 / 1024).toFixed(2)} MB`);
  
  // Monitor memory during preloader
  const memoryInterval = setInterval(() => {
    const currentMemory = performance.memory.usedJSHeapSize;
    const memoryDiff = currentMemory - initialMemory;
    const diffMB = (memoryDiff / 1024 / 1024).toFixed(2);
    
    console.log(`📊 Memory change: ${diffMB} MB`);
    
    if (Math.abs(memoryDiff) > 10 * 1024 * 1024) { // 10MB
      console.warn('⚠️ Significant memory change detected during preloader');
    }
  }, 500);
  
  // Stop monitoring after preloader
  document.addEventListener('preloaderHidden', () => {
    clearInterval(memoryInterval);
    
    setTimeout(() => {
      const finalMemory = performance.memory.usedJSHeapSize;
      const totalChange = finalMemory - initialMemory;
      const changeMB = (totalChange / 1024 / 1024).toFixed(2);
      
      console.log(`✅ Final memory change: ${changeMB} MB`);
      
      if (Math.abs(totalChange) < 5 * 1024 * 1024) { // 5MB
        console.log('✅ Excellent: Minimal memory impact');
      } else if (Math.abs(totalChange) < 10 * 1024 * 1024) { // 10MB
        console.log('⚠️ Good: Acceptable memory usage');
      } else {
        console.log('❌ Poor: High memory usage detected');
      }
    }, 1000);
  });
}

// Test 4: Accessibility Features
function testAccessibility() {
  console.log('\n♿ Accessibility Test:');
  
  const preloader = document.querySelector('.preloader-overlay');
  if (!preloader) {
    console.log('❌ Preloader not found');
    return;
  }
  
  // Check ARIA attributes
  const hasRole = preloader.hasAttribute('role');
  const hasAriaLive = preloader.hasAttribute('aria-live');
  const hasAriaLabel = preloader.hasAttribute('aria-label');
  
  console.log(`✅ Role attribute: ${hasRole ? '✓' : '✗'}`);
  console.log(`✅ Aria-live attribute: ${hasAriaLive ? '✓' : '✗'}`);
  console.log(`✅ Aria-label attribute: ${hasAriaLabel ? '✓' : '✗'}`);
  
  // Check reduced motion support
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  console.log(`✅ Reduced motion preference: ${prefersReducedMotion ? 'Detected' : 'Not detected'}`);
  
  if (hasRole && hasAriaLive && hasAriaLabel) {
    console.log('✅ Excellent: All accessibility features present');
  } else {
    console.log('⚠️ Some accessibility features missing');
  }
}

// Test 5: Theme Consistency
function testThemeConsistency() {
  console.log('\n🎨 Theme Consistency Test:');
  
  const preloader = document.querySelector('.preloader-overlay');
  if (!preloader) {
    console.log('❌ Preloader not found');
    return;
  }
  
  const computedStyle = window.getComputedStyle(preloader);
  const backgroundColor = computedStyle.backgroundColor;
  
  // Check if CSS custom properties are being used
  const rootStyle = window.getComputedStyle(document.documentElement);
  const primaryColor = rootStyle.getPropertyValue('--primary-color').trim();
  const secondaryColor = rootStyle.getPropertyValue('--secondary-color').trim();
  
  console.log(`✅ Primary color: ${primaryColor || 'Not defined'}`);
  console.log(`✅ Secondary color: ${secondaryColor || 'Not defined'}`);
  console.log(`✅ Preloader background: ${backgroundColor}`);
  
  if (primaryColor && secondaryColor) {
    console.log('✅ Excellent: Theme variables properly defined');
  } else {
    console.log('⚠️ Theme variables may not be properly configured');
  }
}

// Test 6: Bundle Impact
function testBundleImpact() {
  console.log('\n📦 Bundle Impact Test:');
  
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const preloaderRelatedScripts = scripts.filter(script => 
    script.src.includes('preloader') || 
    script.src.includes('lottie') ||
    script.src.includes('gsap')
  );
  
  console.log(`✅ Total scripts: ${scripts.length}`);
  console.log(`✅ Preloader-related scripts: ${preloaderRelatedScripts.length}`);
  
  // Check for GSAP and Lottie in the bundle
  const hasGSAP = window.gsap !== undefined;
  const hasLottie = document.querySelector('lottie-player') !== null;
  
  console.log(`✅ GSAP loaded: ${hasGSAP ? '✓' : '✗'}`);
  console.log(`✅ Lottie player: ${hasLottie ? '✓' : '✗'}`);
  
  if (preloaderRelatedScripts.length <= 2) {
    console.log('✅ Excellent: Minimal bundle impact');
  } else {
    console.log('⚠️ Consider optimizing preloader bundle size');
  }
}

// Run all tests
function runPreloaderTests() {
  testPreloaderLoadTime();
  testAnimationPerformance();
  testMemoryUsage();
  testAccessibility();
  testThemeConsistency();
  testBundleImpact();
  
  console.log('\n🎯 Preloader Performance Test Complete!');
  console.log('\n💡 Chrome DevTools Tips:');
  console.log('1. Open Performance tab and record during page load');
  console.log('2. Check for long tasks during preloader animation');
  console.log('3. Use Lighthouse to audit accessibility');
  console.log('4. Monitor memory usage in Memory tab');
  console.log('5. Test with "Reduce motion" accessibility setting');
}

// Auto-run tests
runPreloaderTests();

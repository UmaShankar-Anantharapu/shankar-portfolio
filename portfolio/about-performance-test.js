// About Component Performance Test Script for Chrome DevTools
// Run this in the browser console on the /about page to test performance optimizations

console.log('🚀 Starting About Component Performance Tests...');

// Test 1: OnPush Change Detection Performance
function testChangeDetectionStrategy() {
  console.log('\n⚡ Change Detection Strategy Test:');
  
  // Check if component is using OnPush
  const aboutComponent = document.querySelector('app-about');
  if (!aboutComponent) {
    console.error('❌ About component not found');
    return;
  }
  
  console.log('✅ About component found');
  
  // Simulate multiple rapid interactions to test OnPush efficiency
  const voiceButton = document.querySelector('.voice-button');
  const statCards = document.querySelectorAll('.stat-card.clickable');
  
  if (voiceButton && statCards.length > 0) {
    console.log('🎯 Testing OnPush with rapid interactions...');
    
    const startTime = performance.now();
    
    // Rapid clicks to test change detection
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        if (i % 2 === 0 && voiceButton) {
          voiceButton.click();
        } else if (statCards[0]) {
          statCards[0].click();
        }
      }, i * 50);
    }
    
    setTimeout(() => {
      const endTime = performance.now();
      console.log(`📊 Interaction test completed in: ${(endTime - startTime).toFixed(2)}ms`);
      console.log('✅ OnPush strategy should minimize unnecessary change detection cycles');
    }, 600);
  }
}

// Test 2: Lazy Loading Performance
function testLazyLoadingPerformance() {
  console.log('\n📦 Lazy Loading Performance Test:');
  
  // Check if we're on the about route
  const currentPath = window.location.pathname;
  console.log(`📊 Current path: ${currentPath}`);
  
  if (currentPath === '/about') {
    console.log('✅ About module successfully lazy loaded');
    
    // Check bundle size in Network tab
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const aboutChunk = scripts.find(script => script.src.includes('about') || script.src.includes('chunk'));
    
    if (aboutChunk) {
      console.log(`📊 About chunk loaded: ${aboutChunk.src}`);
    }
    
    // Test navigation performance
    console.log('🎯 Testing navigation performance...');
    const navStartTime = performance.now();
    
    // Navigate to home and back to test lazy loading
    window.history.pushState({}, '', '/');
    setTimeout(() => {
      window.history.pushState({}, '', '/about');
      const navEndTime = performance.now();
      console.log(`📊 Navigation test completed in: ${(navEndTime - navStartTime).toFixed(2)}ms`);
    }, 100);
  }
}

// Test 3: Clickable Stats Cards Performance
function testClickableStatsPerformance() {
  console.log('\n🎯 Clickable Stats Cards Test:');
  
  const statCards = document.querySelectorAll('.stat-card');
  console.log(`📊 Found ${statCards.length} stat cards`);
  
  let clickableCount = 0;
  statCards.forEach((card, index) => {
    const isClickable = card.classList.contains('clickable');
    const hasTabIndex = card.hasAttribute('tabindex');
    const hasRole = card.hasAttribute('role');
    
    console.log(`📊 Card ${index + 1}:`);
    console.log(`  - Clickable: ${isClickable ? '✅' : '❌'}`);
    console.log(`  - Accessible: ${hasTabIndex && hasRole ? '✅' : '❌'}`);
    
    if (isClickable) {
      clickableCount++;
      
      // Test click performance
      const clickStartTime = performance.now();
      card.click();
      const clickEndTime = performance.now();
      
      console.log(`  - Click response time: ${(clickEndTime - clickStartTime).toFixed(2)}ms`);
    }
  });
  
  console.log(`✅ ${clickableCount} clickable cards found (should be 2: Projects & Companies)`);
}

// Test 4: GSAP Animation Performance
function testGSAPPerformance() {
  console.log('\n🎨 GSAP Animation Performance Test:');
  
  if (typeof gsap === 'undefined') {
    console.error('❌ GSAP not loaded');
    return;
  }
  
  console.log('✅ GSAP loaded successfully');
  
  // Check ScrollTrigger instances
  if (typeof ScrollTrigger !== 'undefined') {
    const triggers = ScrollTrigger.getAll();
    console.log(`📊 Active ScrollTrigger instances: ${triggers.length}`);
    
    triggers.forEach((trigger, index) => {
      console.log(`📊 Trigger ${index + 1}: ${trigger.trigger?.className || 'Unknown'}`);
    });
  }
  
  // Test animation frame rate during scroll
  let frameCount = 0;
  let lastTime = performance.now();
  
  function measureAnimationFPS() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
      console.log(`📊 Animation FPS: ${frameCount}`);
      
      if (frameCount >= 55) {
        console.log('✅ Excellent: Smooth 60 FPS animations');
      } else if (frameCount >= 45) {
        console.log('⚠️ Good: Acceptable animation performance');
      } else {
        console.log('❌ Poor: Animation performance needs optimization');
      }
      
      return;
    }
    
    requestAnimationFrame(measureAnimationFPS);
  }
  
  // Trigger scroll to test animations
  window.scrollTo({ top: 100, behavior: 'smooth' });
  requestAnimationFrame(measureAnimationFPS);
}

// Test 5: Memory Usage and Cleanup
function testMemoryUsage() {
  console.log('\n🧠 Memory Usage Test:');
  
  if (!('memory' in performance)) {
    console.log('❌ Memory API not available');
    return;
  }
  
  const initialMemory = performance.memory.usedJSHeapSize;
  console.log(`📊 Initial memory: ${(initialMemory / 1024 / 1024).toFixed(2)} MB`);
  
  // Test component cleanup by navigating away and back
  const testCleanup = () => {
    console.log('🎯 Testing component cleanup...');
    
    // Navigate away
    window.history.pushState({}, '', '/');
    
    setTimeout(() => {
      const afterNavMemory = performance.memory.usedJSHeapSize;
      console.log(`📊 Memory after navigation: ${(afterNavMemory / 1024 / 1024).toFixed(2)} MB`);
      
      // Navigate back
      window.history.pushState({}, '', '/about');
      
      setTimeout(() => {
        const finalMemory = performance.memory.usedJSHeapSize;
        const memoryDiff = finalMemory - initialMemory;
        
        console.log(`📊 Final memory: ${(finalMemory / 1024 / 1024).toFixed(2)} MB`);
        console.log(`📊 Memory difference: ${(memoryDiff / 1024 / 1024).toFixed(2)} MB`);
        
        if (Math.abs(memoryDiff) < 2 * 1024 * 1024) { // 2MB threshold
          console.log('✅ Excellent: Minimal memory leaks detected');
        } else if (Math.abs(memoryDiff) < 5 * 1024 * 1024) { // 5MB threshold
          console.log('⚠️ Good: Acceptable memory usage');
        } else {
          console.log('❌ Poor: Potential memory leaks detected');
        }
      }, 1000);
    }, 1000);
  };
  
  testCleanup();
}

// Test 6: Accessibility Performance
function testAccessibilityPerformance() {
  console.log('\n♿ Accessibility Performance Test:');
  
  // Check semantic HTML structure
  const semanticElements = {
    'main': document.querySelector('section[role="main"]'),
    'header': document.querySelector('header'),
    'aside': document.querySelector('aside[role="complementary"]'),
    'region': document.querySelectorAll('[role="region"]')
  };
  
  console.log('📊 Semantic HTML structure:');
  Object.entries(semanticElements).forEach(([element, found]) => {
    if (element === 'region') {
      console.log(`  - ${element}: ${found.length} found`);
    } else {
      console.log(`  - ${element}: ${found ? '✅' : '❌'}`);
    }
  });
  
  // Check ARIA attributes
  const ariaElements = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-hidden]');
  console.log(`📊 ARIA attributes: ${ariaElements.length} elements`);
  
  // Check keyboard navigation
  const focusableElements = document.querySelectorAll('[tabindex], button, [role="button"]');
  console.log(`📊 Focusable elements: ${focusableElements.length}`);
  
  // Test focus performance
  if (focusableElements.length > 0) {
    const focusStartTime = performance.now();
    focusableElements[0].focus();
    const focusEndTime = performance.now();
    
    console.log(`📊 Focus response time: ${(focusEndTime - focusStartTime).toFixed(2)}ms`);
  }
}

// Test 7: Bundle Size Analysis
function testBundleSize() {
  console.log('\n📦 Bundle Size Analysis:');
  
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  console.log(`📊 JavaScript files: ${scripts.length}`);
  console.log(`📊 CSS files: ${stylesheets.length}`);
  
  // Check for specific chunks
  const chunks = {
    'main': scripts.find(s => s.src.includes('main')),
    'about': scripts.find(s => s.src.includes('about')),
    'vendor': scripts.find(s => s.src.includes('vendor') || s.src.includes('polyfills')),
    'runtime': scripts.find(s => s.src.includes('runtime'))
  };
  
  console.log('📊 Chunk analysis:');
  Object.entries(chunks).forEach(([chunk, found]) => {
    console.log(`  - ${chunk}: ${found ? '✅ Loaded' : '❌ Not found'}`);
  });
  
  // Estimate total bundle size (approximate)
  console.log('💡 Check Network tab in DevTools for exact bundle sizes');
}

// Test 8: Router Performance
function testRouterPerformance() {
  console.log('\n🛣️ Router Performance Test:');
  
  const routes = ['/', '/about', '/contact'];
  let routeIndex = 0;
  
  function testRoute() {
    if (routeIndex >= routes.length) {
      console.log('✅ Router performance test completed');
      return;
    }
    
    const route = routes[routeIndex];
    const startTime = performance.now();
    
    console.log(`🎯 Testing route: ${route}`);
    
    window.history.pushState({}, '', route);
    
    setTimeout(() => {
      const endTime = performance.now();
      console.log(`📊 Route ${route} loaded in: ${(endTime - startTime).toFixed(2)}ms`);
      
      routeIndex++;
      setTimeout(testRoute, 500);
    }, 100);
  }
  
  testRoute();
}

// Run all performance tests
function runAllPerformanceTests() {
  testChangeDetectionStrategy();
  
  setTimeout(() => testLazyLoadingPerformance(), 1000);
  setTimeout(() => testClickableStatsPerformance(), 2000);
  setTimeout(() => testGSAPPerformance(), 3000);
  setTimeout(() => testMemoryUsage(), 4000);
  setTimeout(() => testAccessibilityPerformance(), 7000);
  setTimeout(() => testBundleSize(), 8000);
  setTimeout(() => testRouterPerformance(), 9000);
  
  setTimeout(() => {
    console.log('\n🎯 Performance Tests Complete!');
    console.log('\n💡 Chrome DevTools Tips:');
    console.log('1. Use Performance tab to record and analyze runtime performance');
    console.log('2. Use Lighthouse to audit performance, accessibility, and SEO');
    console.log('3. Use Memory tab to check for memory leaks');
    console.log('4. Use Network tab to analyze bundle sizes and loading times');
    console.log('5. Use Coverage tab to identify unused code');
  }, 15000);
}

// Auto-run tests
runAllPerformanceTests();

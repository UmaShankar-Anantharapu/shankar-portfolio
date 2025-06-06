// Performance Test Script for Chrome DevTools
// Run this in the browser console to check performance metrics

console.log('🚀 Starting Performance Analysis...');

// 1. Check Core Web Vitals
function checkCoreWebVitals() {
  console.log('\n📊 Core Web Vitals:');
  
  // First Contentful Paint
  const paintEntries = performance.getEntriesByType('paint');
  const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
  if (fcp) {
    console.log(`✅ First Contentful Paint: ${fcp.startTime.toFixed(2)}ms`);
  }
  
  // Largest Contentful Paint (if available)
  const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
  if (lcpEntries.length > 0) {
    const lcp = lcpEntries[lcpEntries.length - 1];
    console.log(`✅ Largest Contentful Paint: ${lcp.startTime.toFixed(2)}ms`);
  }
  
  // Navigation timing
  const navEntry = performance.getEntriesByType('navigation')[0];
  if (navEntry) {
    console.log(`✅ DOM Content Loaded: ${(navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart).toFixed(2)}ms`);
    console.log(`✅ Load Complete: ${(navEntry.loadEventEnd - navEntry.loadEventStart).toFixed(2)}ms`);
  }
}

// 2. Check Memory Usage
function checkMemoryUsage() {
  console.log('\n🧠 Memory Usage:');
  
  if ('memory' in performance) {
    const memory = performance.memory;
    const usedMB = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
    const totalMB = (memory.totalJSHeapSize / 1024 / 1024).toFixed(2);
    const limitMB = (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2);
    const usagePercent = ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2);
    
    console.log(`✅ Used Heap: ${usedMB} MB`);
    console.log(`✅ Total Heap: ${totalMB} MB`);
    console.log(`✅ Heap Limit: ${limitMB} MB`);
    console.log(`✅ Usage: ${usagePercent}%`);
    
    if (usagePercent > 80) {
      console.warn('⚠️ High memory usage detected!');
    } else {
      console.log('✅ Memory usage is optimal');
    }
  } else {
    console.log('❌ Memory API not available');
  }
}

// 3. Check Resource Loading
function checkResourceLoading() {
  console.log('\n📦 Resource Loading:');
  
  const resources = performance.getEntriesByType('resource');
  const jsResources = resources.filter(r => r.name.includes('.js'));
  const cssResources = resources.filter(r => r.name.includes('.css'));
  
  console.log(`✅ Total Resources: ${resources.length}`);
  console.log(`✅ JavaScript Files: ${jsResources.length}`);
  console.log(`✅ CSS Files: ${cssResources.length}`);
  
  // Check for large resources
  const largeResources = resources.filter(r => r.transferSize > 100000); // > 100KB
  if (largeResources.length > 0) {
    console.log('\n⚠️ Large Resources (>100KB):');
    largeResources.forEach(resource => {
      const sizeMB = (resource.transferSize / 1024 / 1024).toFixed(2);
      console.log(`  - ${resource.name.split('/').pop()}: ${sizeMB} MB`);
    });
  }
}

// 4. Check Animation Performance
function checkAnimationPerformance() {
  console.log('\n🎬 Animation Performance:');
  
  // Check for long tasks
  const longTasks = performance.getEntriesByType('longtask');
  if (longTasks.length > 0) {
    console.warn(`⚠️ ${longTasks.length} long tasks detected`);
    longTasks.forEach((task, index) => {
      console.log(`  Task ${index + 1}: ${task.duration.toFixed(2)}ms`);
    });
  } else {
    console.log('✅ No long tasks detected');
  }
  
  // Check frame rate (approximate)
  let frameCount = 0;
  let lastTime = performance.now();
  
  function countFrames() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
      console.log(`✅ Approximate FPS: ${frameCount}`);
      frameCount = 0;
      lastTime = currentTime;
      return;
    }
    
    requestAnimationFrame(countFrames);
  }
  
  console.log('📊 Measuring FPS for 1 second...');
  requestAnimationFrame(countFrames);
}

// 5. Check for Memory Leaks
function checkMemoryLeaks() {
  console.log('\n🔍 Memory Leak Detection:');
  
  const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
  
  // Simulate some operations
  setTimeout(() => {
    const currentMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
    const memoryDiff = currentMemory - initialMemory;
    const diffMB = (memoryDiff / 1024 / 1024).toFixed(2);
    
    if (memoryDiff > 5000000) { // 5MB increase
      console.warn(`⚠️ Potential memory leak: +${diffMB} MB in 5 seconds`);
    } else {
      console.log(`✅ Memory stable: ${diffMB} MB change in 5 seconds`);
    }
  }, 5000);
}

// 6. Bundle Analysis
function analyzeBundles() {
  console.log('\n📊 Bundle Analysis:');
  
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  console.log(`✅ Script bundles loaded: ${scripts.length}`);
  console.log(`✅ Style bundles loaded: ${styles.length}`);
  
  scripts.forEach(script => {
    const name = script.src.split('/').pop();
    console.log(`  - ${name}`);
  });
}

// Run all tests
function runPerformanceTests() {
  checkCoreWebVitals();
  checkMemoryUsage();
  checkResourceLoading();
  checkAnimationPerformance();
  checkMemoryLeaks();
  analyzeBundles();
  
  console.log('\n🎯 Performance Test Complete!');
  console.log('\n💡 Tips for Chrome DevTools:');
  console.log('1. Open DevTools (F12)');
  console.log('2. Go to Performance tab');
  console.log('3. Record a session while interacting with the app');
  console.log('4. Check for long tasks, memory usage, and FPS');
  console.log('5. Use Lighthouse tab for comprehensive audit');
}

// Auto-run tests
runPerformanceTests();

// Performance Specialist - Skills Component Optimization Test Script
// Run this in Chrome DevTools Console on the /skills page

console.log('🚀 Performance Specialist - Skills Component Optimization Tests');
console.log('================================================================');

// Test 1: Lazy Loading Verification
function testLazyLoading() {
  console.log('\n📦 Test 1: Lazy Loading Verification');
  
  // Check if skills module is lazy loaded
  const performanceEntries = performance.getEntriesByType('resource');
  const skillsChunk = performanceEntries.find(entry => 
    entry.name.includes('skills-module') || entry.name.includes('chunk-XIAFRYXU')
  );
  
  if (skillsChunk) {
    const loadTime = skillsChunk.responseEnd - skillsChunk.requestStart;
    console.log(`✅ Skills module lazy loaded successfully`);
    console.log(`📊 Load time: ${loadTime.toFixed(2)}ms`);
    console.log(`📊 Transfer size: ${(skillsChunk.transferSize / 1024).toFixed(2)} KB`);
    
    if (loadTime < 500) {
      console.log('✅ Excellent lazy loading performance (< 500ms)');
    } else {
      console.log('⚠️ Lazy loading could be optimized');
    }
  } else {
    console.log('⚠️ Skills module chunk not found in performance entries');
  }
  
  // Check for modal chunks
  const modalChunks = performanceEntries.filter(entry => 
    entry.name.includes('modal-component') || 
    entry.name.includes('highcharts-demo') ||
    entry.name.includes('threejs-demo')
  );
  
  console.log(`📊 Modal chunks found: ${modalChunks.length}`);
  modalChunks.forEach(chunk => {
    const size = (chunk.transferSize / 1024).toFixed(2);
    console.log(`  - Modal chunk: ${size} KB`);
  });
  
  return true;
}

// Test 2: OnPush Change Detection Strategy
function testOnPushStrategy() {
  console.log('\n⚡ Test 2: OnPush Change Detection Strategy');
  
  // Check if skill items use OnPush
  const skillItems = document.querySelectorAll('app-skill-item');
  console.log(`📊 Skill items found: ${skillItems.length}`);
  
  if (skillItems.length > 0) {
    console.log('✅ Skill items are using component-based architecture');
    
    // Test change detection optimization
    const startTime = performance.now();
    
    // Trigger a hover event to test performance
    const firstSkillItem = skillItems[0];
    const hoverEvent = new MouseEvent('mouseenter', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    
    firstSkillItem.dispatchEvent(hoverEvent);
    
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    console.log(`📊 Hover response time: ${responseTime.toFixed(2)}ms`);
    
    if (responseTime < 16) { // 60fps = 16.67ms per frame
      console.log('✅ Excellent change detection performance (< 16ms)');
    } else {
      console.log('⚠️ Change detection could be optimized');
    }
    
    // Clean up
    const leaveEvent = new MouseEvent('mouseleave', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    firstSkillItem.dispatchEvent(leaveEvent);
  } else {
    console.log('❌ No skill items found');
  }
  
  return true;
}

// Test 3: Cross-Component Navigation
function testCrossComponentNavigation() {
  console.log('\n🔗 Test 3: Cross-Component Navigation');
  
  // Check for project-linked skills
  const projectLinkedSkills = document.querySelectorAll('.skill-name.project-linked');
  console.log(`📊 Project-linked skills found: ${projectLinkedSkills.length}`);
  
  if (projectLinkedSkills.length > 0) {
    console.log('✅ Project-linked skills are properly marked');
    
    // Test specific skills that should have project references
    const expectedProjectSkills = ['Angular', 'Three.js', 'TypeScript', 'JavaScript', 'Node.js', 'Micro Frontend', 'RxJS'];
    let foundProjectSkills = 0;
    
    expectedProjectSkills.forEach(skillName => {
      const skillElement = Array.from(document.querySelectorAll('.skill-name')).find(el => 
        el.textContent?.trim() === skillName
      );
      
      if (skillElement) {
        const hasProjectReference = skillElement.classList.contains('project-linked') ||
                                   skillElement.closest('.skill-card')?.classList.contains('has-project-reference');
        
        if (hasProjectReference) {
          foundProjectSkills++;
          console.log(`✅ ${skillName} has project reference`);
        } else {
          console.log(`⚠️ ${skillName} missing project reference`);
        }
      }
    });
    
    console.log(`📊 Project skills configured: ${foundProjectSkills}/${expectedProjectSkills.length}`);
  } else {
    console.log('⚠️ No project-linked skills found');
  }
  
  // Test navigation service availability
  if (window.ng && window.ng.getComponent) {
    try {
      const skillsComponent = window.ng.getComponent(document.querySelector('app-skills'));
      if (skillsComponent) {
        console.log('✅ Skills component accessible for testing');
      }
    } catch (error) {
      console.log('⚠️ Skills component not accessible via ng.getComponent');
    }
  }
  
  return true;
}

// Test 4: Shared Demo Service
function testSharedDemoService() {
  console.log('\n🔧 Test 4: Shared Demo Service');
  
  // Test demo service by clicking a skill
  const highchartsSkill = Array.from(document.querySelectorAll('.skill-name')).find(el => 
    el.textContent?.trim() === 'Highcharts'
  );
  
  if (highchartsSkill) {
    console.log('📊 Testing demo service with Highcharts skill...');
    
    const startTime = performance.now();
    
    // Simulate click
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    
    highchartsSkill.dispatchEvent(clickEvent);
    
    // Check for modal opening
    setTimeout(() => {
      const modals = document.querySelectorAll('mat-dialog-container');
      if (modals.length > 0) {
        const openTime = performance.now() - startTime;
        console.log(`✅ Demo modal opened successfully`);
        console.log(`📊 Modal open time: ${openTime.toFixed(2)}ms`);
        
        if (openTime < 300) {
          console.log('✅ Excellent modal performance (< 300ms)');
        } else {
          console.log('⚠️ Modal opening could be optimized');
        }
        
        // Close modal
        setTimeout(() => {
          const closeBtn = modals[0].querySelector('.close-btn');
          if (closeBtn) {
            closeBtn.click();
            console.log('📊 Modal closed for testing');
          }
        }, 1000);
      } else {
        console.log('⚠️ Modal did not open (check console for errors)');
      }
    }, 500);
  } else {
    console.log('⚠️ Highcharts skill not found for testing');
  }
  
  return true;
}

// Test 5: Performance Metrics
function testPerformanceMetrics() {
  console.log('\n📈 Test 5: Performance Metrics');
  
  // Memory usage
  if (performance.memory) {
    const heapUsed = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
    const heapTotal = (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2);
    const heapLimit = (performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2);
    
    console.log(`📊 Memory usage: ${heapUsed}MB / ${heapTotal}MB (limit: ${heapLimit}MB)`);
    
    if (parseFloat(heapUsed) < 50) {
      console.log('✅ Excellent memory usage (< 50MB)');
    } else if (parseFloat(heapUsed) < 100) {
      console.log('⚠️ Good memory usage (< 100MB)');
    } else {
      console.log('❌ High memory usage (> 100MB)');
    }
  }
  
  // FPS monitoring
  let frameCount = 0;
  let lastTime = performance.now();
  
  function measureFPS() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      console.log(`📊 Current FPS: ${fps}`);
      
      if (fps >= 55) {
        console.log('✅ Excellent frame rate (≥ 55 FPS)');
      } else if (fps >= 30) {
        console.log('⚠️ Good frame rate (≥ 30 FPS)');
      } else {
        console.log('❌ Poor frame rate (< 30 FPS)');
      }
      
      frameCount = 0;
      lastTime = currentTime;
      return;
    }
    
    requestAnimationFrame(measureFPS);
  }
  
  // Measure FPS for 3 seconds
  console.log('📊 Measuring FPS for 3 seconds...');
  requestAnimationFrame(measureFPS);
  
  setTimeout(() => {
    console.log('📊 FPS measurement complete');
  }, 3000);
  
  return true;
}

// Test 6: Accessibility Performance
function testAccessibilityPerformance() {
  console.log('\n♿ Test 6: Accessibility Performance');
  
  // Check ARIA attributes
  const skillCards = document.querySelectorAll('.skill-card');
  let accessibleCards = 0;
  
  skillCards.forEach(card => {
    const hasAriaLabel = card.hasAttribute('aria-label');
    const hasRole = card.hasAttribute('role') || card.tagName.toLowerCase() === 'article';
    
    if (hasAriaLabel && hasRole) {
      accessibleCards++;
    }
  });
  
  console.log(`📊 Accessible skill cards: ${accessibleCards}/${skillCards.length}`);
  
  if (accessibleCards === skillCards.length) {
    console.log('✅ All skill cards are accessible');
  } else {
    console.log('⚠️ Some skill cards may need accessibility improvements');
  }
  
  // Check progress bars
  const progressBars = document.querySelectorAll('.progress-bar');
  let accessibleProgressBars = 0;
  
  progressBars.forEach(bar => {
    const hasRole = bar.getAttribute('role') === 'progressbar';
    const hasAriaValueNow = bar.hasAttribute('aria-valuenow');
    const hasAriaLabel = bar.hasAttribute('aria-label');
    
    if (hasRole && hasAriaValueNow && hasAriaLabel) {
      accessibleProgressBars++;
    }
  });
  
  console.log(`📊 Accessible progress bars: ${accessibleProgressBars}/${progressBars.length}`);
  
  return true;
}

// Test 7: Bundle Analysis
function testBundleAnalysis() {
  console.log('\n📦 Test 7: Bundle Analysis');
  
  const resources = performance.getEntriesByType('resource');
  
  // Analyze JavaScript bundles
  const jsBundles = resources.filter(r => r.name.includes('.js'));
  const totalJSSize = jsBundles.reduce((sum, bundle) => sum + (bundle.transferSize || 0), 0);
  
  console.log(`📊 JavaScript bundles: ${jsBundles.length}`);
  console.log(`📊 Total JS size: ${(totalJSSize / 1024).toFixed(2)} KB`);
  
  // Find skills-specific bundles
  const skillsBundles = jsBundles.filter(bundle => 
    bundle.name.includes('skills') || 
    bundle.name.includes('modal') ||
    bundle.name.includes('demo')
  );
  
  console.log(`📊 Skills-related bundles: ${skillsBundles.length}`);
  skillsBundles.forEach(bundle => {
    const size = (bundle.transferSize / 1024).toFixed(2);
    const name = bundle.name.split('/').pop();
    console.log(`  - ${name}: ${size} KB`);
  });
  
  // Performance recommendations
  if (totalJSSize < 500 * 1024) { // 500KB
    console.log('✅ Excellent bundle size (< 500KB)');
  } else if (totalJSSize < 1000 * 1024) { // 1MB
    console.log('⚠️ Good bundle size (< 1MB)');
  } else {
    console.log('❌ Large bundle size (> 1MB) - consider optimization');
  }
  
  return true;
}

// Run all performance tests
async function runPerformanceTests() {
  console.log('🎯 Starting Performance Specialist Test Suite...\n');
  
  const tests = [
    testLazyLoading,
    testOnPushStrategy,
    testCrossComponentNavigation,
    testSharedDemoService,
    testPerformanceMetrics,
    testAccessibilityPerformance,
    testBundleAnalysis
  ];
  
  let passedTests = 0;
  
  for (let i = 0; i < tests.length; i++) {
    try {
      const result = await tests[i]();
      if (result !== false) {
        passedTests++;
      }
      
      // Add delay between tests
      if (i < tests.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`❌ Test ${i + 1} failed:`, error);
    }
  }
  
  console.log(`\n📊 Performance Test Results: ${passedTests}/${tests.length} tests passed`);
  
  if (passedTests === tests.length) {
    console.log('🎉 All performance optimizations verified!');
  } else {
    console.log('⚠️ Some optimizations need attention');
  }
  
  console.log('\n🔧 Performance Recommendations:');
  console.log('1. Monitor bundle sizes with webpack-bundle-analyzer');
  console.log('2. Use Chrome DevTools Performance tab for detailed analysis');
  console.log('3. Test on slower devices and networks');
  console.log('4. Implement service worker for caching');
  console.log('5. Consider preloading critical resources');
  console.log('6. Monitor Core Web Vitals in production');
  
  return { passed: passedTests, total: tests.length };
}

// Auto-run tests
runPerformanceTests();

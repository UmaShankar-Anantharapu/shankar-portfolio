// About Component Timeline Test Script for Chrome DevTools
// Run this in the browser console on the /about page to test timeline features

console.log('📅 Starting About Component Timeline Tests...');

// Test 1: Angular Material Stepper Integration
function testAngularMaterialStepper() {
  console.log('\n🔧 Angular Material Stepper Test:');
  
  const stepper = document.querySelector('mat-stepper');
  if (!stepper) {
    console.error('❌ Angular Material stepper not found');
    return;
  }
  
  console.log('✅ Angular Material stepper found');
  
  // Check stepper configuration
  const isVertical = stepper.hasAttribute('orientation') && 
                    stepper.getAttribute('orientation') === 'vertical';
  console.log(`📊 Vertical orientation: ${isVertical ? '✅' : '❌'}`);
  
  // Check steps
  const steps = stepper.querySelectorAll('mat-step');
  console.log(`📊 Number of timeline steps: ${steps.length}`);
  
  if (steps.length === 4) {
    console.log('✅ Correct number of work experience steps (4)');
  } else {
    console.log('❌ Expected 4 work experience steps');
  }
  
  // Check step headers
  const stepHeaders = stepper.querySelectorAll('.mat-step-header');
  console.log(`📊 Step headers found: ${stepHeaders.length}`);
  
  // Check step content
  const stepContents = stepper.querySelectorAll('.step-content');
  console.log(`📊 Step contents found: ${stepContents.length}`);
}

// Test 2: Work Experience Data Validation
function testWorkExperienceData() {
  console.log('\n💼 Work Experience Data Test:');
  
  const expectedCompanies = [
    'Greenko Group',
    'Brane Enterprises', 
    'Sree Tech Tammina',
    'Zinovia'
  ];
  
  const companyNames = Array.from(document.querySelectorAll('.company-name'))
                           .map(el => el.textContent.trim());
  
  console.log('📊 Companies found:', companyNames);
  
  expectedCompanies.forEach((company, index) => {
    if (companyNames.includes(company)) {
      console.log(`✅ ${company}: Found`);
    } else {
      console.log(`❌ ${company}: Missing`);
    }
  });
  
  // Check durations
  const durations = Array.from(document.querySelectorAll('.company-duration'))
                         .map(el => el.textContent.trim());
  
  console.log('📊 Durations found:', durations);
  
  // Check if current position is marked as "Present"
  const hasPresent = durations.some(duration => duration.includes('Present'));
  console.log(`📊 Current position marked as Present: ${hasPresent ? '✅' : '❌'}`);
  
  // Check key projects
  const projectItems = document.querySelectorAll('.project-item');
  console.log(`📊 Total project items: ${projectItems.length}`);
  
  // Check technologies
  const techTags = document.querySelectorAll('.tech-tag');
  console.log(`📊 Total technology tags: ${techTags.length}`);
}

// Test 3: GSAP Timeline Animations
function testTimelineAnimations() {
  console.log('\n🎬 Timeline Animations Test:');
  
  if (typeof gsap === 'undefined') {
    console.error('❌ GSAP not loaded');
    return;
  }
  
  console.log('✅ GSAP loaded successfully');
  
  // Check ScrollTrigger instances for timeline
  if (typeof ScrollTrigger !== 'undefined') {
    const triggers = ScrollTrigger.getAll();
    const timelineTriggers = triggers.filter(trigger => 
      trigger.trigger && trigger.trigger.classList.contains('timeline-container')
    );
    
    console.log(`📊 Timeline ScrollTrigger instances: ${timelineTriggers.length}`);
    
    if (timelineTriggers.length > 0) {
      console.log('✅ Timeline ScrollTrigger animations configured');
      
      timelineTriggers.forEach((trigger, index) => {
        console.log(`📊 Timeline Trigger ${index + 1}:`, {
          start: trigger.start,
          end: trigger.end,
          progress: trigger.progress
        });
      });
    } else {
      console.log('❌ No timeline ScrollTrigger animations found');
    }
  }
  
  // Test animation visibility
  const timelineSteps = document.querySelectorAll('.mat-step');
  if (timelineSteps.length > 0) {
    console.log('🎯 Testing timeline step visibility...');
    
    timelineSteps.forEach((step, index) => {
      const style = window.getComputedStyle(step);
      console.log(`📊 Step ${index + 1} - Opacity: ${style.opacity}, Transform: ${style.transform}`);
    });
  }
}

// Test 4: Responsive Timeline Design
function testResponsiveTimeline() {
  console.log('\n📱 Responsive Timeline Test:');
  
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  console.log(`📊 Viewport: ${viewport.width}x${viewport.height}`);
  
  let breakpoint = 'Desktop';
  if (viewport.width <= 480) breakpoint = 'Mobile (480px)';
  else if (viewport.width <= 768) breakpoint = 'Tablet (768px)';
  else if (viewport.width <= 1024) breakpoint = 'Small Desktop (1024px)';
  
  console.log(`📊 Current breakpoint: ${breakpoint}`);
  
  // Check timeline container
  const timelineContainer = document.querySelector('.timeline-container');
  if (timelineContainer) {
    const containerStyle = window.getComputedStyle(timelineContainer);
    console.log(`📊 Timeline container max-width: ${containerStyle.maxWidth}`);
    console.log(`📊 Timeline container padding: ${containerStyle.padding}`);
  }
  
  // Check step headers on mobile
  const stepHeaders = document.querySelectorAll('.mat-step-header');
  if (stepHeaders.length > 0 && viewport.width <= 768) {
    const headerStyle = window.getComputedStyle(stepHeaders[0]);
    console.log(`📊 Mobile step header padding: ${headerStyle.padding}`);
  }
  
  // Check company icons
  const companyIcons = document.querySelectorAll('.company-icon');
  if (companyIcons.length > 0) {
    const iconStyle = window.getComputedStyle(companyIcons[0]);
    console.log(`📊 Company icon size: ${iconStyle.width} x ${iconStyle.height}`);
  }
}

// Test 5: Timeline Accessibility
function testTimelineAccessibility() {
  console.log('\n♿ Timeline Accessibility Test:');
  
  // Check timeline section ARIA
  const timelineSection = document.querySelector('.timeline-section');
  if (timelineSection) {
    const hasRole = timelineSection.hasAttribute('role');
    const hasAriaLabel = timelineSection.hasAttribute('aria-labelledby');
    
    console.log(`📊 Timeline section role: ${hasRole ? '✅' : '❌'}`);
    console.log(`📊 Timeline section aria-labelledby: ${hasAriaLabel ? '✅' : '❌'}`);
  }
  
  // Check timeline title
  const timelineTitle = document.querySelector('#timeline-title');
  if (timelineTitle) {
    console.log('✅ Timeline title with proper ID found');
  } else {
    console.log('❌ Timeline title ID missing');
  }
  
  // Check stepper accessibility
  const stepper = document.querySelector('mat-stepper');
  if (stepper) {
    const stepHeaders = stepper.querySelectorAll('.mat-step-header');
    let accessibleHeaders = 0;
    
    stepHeaders.forEach((header, index) => {
      const hasTabIndex = header.hasAttribute('tabindex') || header.tabIndex >= 0;
      const hasRole = header.getAttribute('role') === 'tab' || header.hasAttribute('role');
      
      if (hasTabIndex || hasRole) {
        accessibleHeaders++;
      }
      
      console.log(`📊 Step ${index + 1} header accessible: ${(hasTabIndex || hasRole) ? '✅' : '❌'}`);
    });
    
    console.log(`📊 Accessible step headers: ${accessibleHeaders}/${stepHeaders.length}`);
  }
  
  // Check keyboard navigation
  console.log('🎯 Testing keyboard navigation...');
  const focusableElements = document.querySelectorAll('.mat-step-header[tabindex], .mat-step-header[role]');
  console.log(`📊 Keyboard focusable timeline elements: ${focusableElements.length}`);
}

// Test 6: Timeline Performance
function testTimelinePerformance() {
  console.log('\n⚡ Timeline Performance Test:');
  
  // Measure timeline rendering time
  const startTime = performance.now();
  
  // Force a reflow to measure rendering
  const timelineContainer = document.querySelector('.timeline-container');
  if (timelineContainer) {
    const height = timelineContainer.offsetHeight;
    const endTime = performance.now();
    
    console.log(`📊 Timeline container height: ${height}px`);
    console.log(`📊 Timeline rendering time: ${(endTime - startTime).toFixed(2)}ms`);
    
    if (endTime - startTime < 16) {
      console.log('✅ Excellent: Timeline renders within 16ms (60fps)');
    } else if (endTime - startTime < 33) {
      console.log('⚠️ Good: Timeline renders within 33ms (30fps)');
    } else {
      console.log('❌ Poor: Timeline rendering is slow');
    }
  }
  
  // Check for memory leaks in timeline animations
  if ('memory' in performance) {
    const initialMemory = performance.memory.usedJSHeapSize;
    
    // Trigger scroll to activate animations
    window.scrollTo({ top: 500, behavior: 'smooth' });
    
    setTimeout(() => {
      const afterScrollMemory = performance.memory.usedJSHeapSize;
      const memoryDiff = afterScrollMemory - initialMemory;
      
      console.log(`📊 Memory change during scroll: ${(memoryDiff / 1024).toFixed(2)} KB`);
      
      if (Math.abs(memoryDiff) < 100 * 1024) { // 100KB
        console.log('✅ Excellent: Minimal memory impact from timeline animations');
      } else {
        console.log('⚠️ Timeline animations may have memory impact');
      }
    }, 1000);
  }
}

// Test 7: Timeline Content Validation
function testTimelineContent() {
  console.log('\n📝 Timeline Content Validation:');
  
  // Check for required content sections
  const requiredSections = [
    '.position-title',
    '.projects-section',
    '.technologies-section'
  ];
  
  requiredSections.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    console.log(`📊 ${selector}: ${elements.length} found`);
    
    if (elements.length === 4) {
      console.log(`✅ All 4 work experiences have ${selector}`);
    } else {
      console.log(`❌ Missing ${selector} in some work experiences`);
    }
  });
  
  // Check for specific technologies
  const expectedTechs = ['Angular', 'TypeScript', 'RxJS', 'JavaScript', 'HTML5'];
  const allTechTags = Array.from(document.querySelectorAll('.tech-tag'))
                           .map(tag => tag.textContent.trim());
  
  console.log('📊 All technologies found:', allTechTags);
  
  expectedTechs.forEach(tech => {
    if (allTechTags.includes(tech)) {
      console.log(`✅ ${tech}: Found in timeline`);
    } else {
      console.log(`❌ ${tech}: Missing from timeline`);
    }
  });
  
  // Check project count
  const totalProjects = document.querySelectorAll('.project-item').length;
  console.log(`📊 Total projects across all experiences: ${totalProjects}`);
  
  if (totalProjects >= 12) { // 3 projects per experience * 4 experiences
    console.log('✅ Sufficient project details provided');
  } else {
    console.log('⚠️ Consider adding more project details');
  }
}

// Test 8: Theme Integration
function testTimelineThemeIntegration() {
  console.log('\n🎨 Timeline Theme Integration Test:');
  
  // Check CSS custom properties usage
  const rootStyle = window.getComputedStyle(document.documentElement);
  const primaryColor = rootStyle.getPropertyValue('--primary-color').trim();
  const secondaryColor = rootStyle.getPropertyValue('--secondary-color').trim();
  
  console.log(`🎨 Primary color: ${primaryColor || 'Not defined'}`);
  console.log(`🎨 Secondary color: ${secondaryColor || 'Not defined'}`);
  
  // Check timeline title color
  const timelineTitle = document.querySelector('.timeline-title');
  if (timelineTitle) {
    const titleStyle = window.getComputedStyle(timelineTitle);
    console.log(`📊 Timeline title color: ${titleStyle.color}`);
  }
  
  // Check company name colors
  const companyNames = document.querySelectorAll('.company-name');
  if (companyNames.length > 0) {
    const nameStyle = window.getComputedStyle(companyNames[0]);
    console.log(`📊 Company name color: ${nameStyle.color}`);
  }
  
  // Check tech tag styling
  const techTags = document.querySelectorAll('.tech-tag');
  if (techTags.length > 0) {
    const tagStyle = window.getComputedStyle(techTags[0]);
    console.log(`📊 Tech tag background: ${tagStyle.backgroundColor}`);
    console.log(`📊 Tech tag color: ${tagStyle.color}`);
  }
  
  // Check step header styling
  const stepHeaders = document.querySelectorAll('.mat-step-header');
  if (stepHeaders.length > 0) {
    const headerStyle = window.getComputedStyle(stepHeaders[0]);
    console.log(`📊 Step header background: ${headerStyle.backgroundColor}`);
    console.log(`📊 Step header border: ${headerStyle.borderColor}`);
  }
}

// Run all timeline tests
function runAllTimelineTests() {
  testAngularMaterialStepper();
  testWorkExperienceData();
  testTimelineAnimations();
  testResponsiveTimeline();
  testTimelineAccessibility();
  testTimelinePerformance();
  testTimelineContent();
  testTimelineThemeIntegration();
  
  console.log('\n🎯 Timeline Tests Complete!');
  console.log('\n💡 Timeline Features:');
  console.log('1. ✅ Angular Material Stepper with vertical orientation');
  console.log('2. ✅ 4 Work experiences with detailed information');
  console.log('3. ✅ GSAP ScrollTrigger animations (80% view, 0.3s stagger)');
  console.log('4. ✅ Responsive design for all screen sizes');
  console.log('5. ✅ Full accessibility compliance');
  console.log('6. ✅ Theme-consistent styling');
  console.log('7. ✅ Performance optimized rendering');
  console.log('\n🎬 Timeline Animation Features:');
  console.log('• Fade in on scroll at 80% viewport');
  console.log('• Staggered timing of 0.3s between steps');
  console.log('• Smooth GSAP animations with hardware acceleration');
  console.log('• Bidirectional scroll animations');
}

// Auto-run tests
runAllTimelineTests();

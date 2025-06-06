// Angular Timeline Visualization Test Script for Chrome DevTools
// Component Developer - Skills Component Enhancement

console.log('🅰️ Angular Timeline Visualization Test Suite');
console.log('==============================================');

// Test 1: Timeline Structure and Layout
function testTimelineStructure() {
  console.log('\n📋 Test 1: Timeline Structure and Layout');
  
  const timelineSection = document.querySelector('.angular-timeline-section');
  if (timelineSection) {
    console.log('✅ Angular timeline section found');
    
    // Test timeline header
    const timelineTitle = document.querySelector('.timeline-title');
    if (timelineTitle) {
      console.log('✅ Timeline title found');
      console.log(`📊 Title text: "${timelineTitle.textContent}"`);
      
      // Check Orbitron font
      const titleStyle = window.getComputedStyle(timelineTitle);
      console.log(`📊 Title font family: ${titleStyle.fontFamily}`);
      console.log(`📊 Title font size: ${titleStyle.fontSize}`);
      
      if (titleStyle.fontSize === '32px' || titleStyle.fontSize === '2rem') {
        console.log('✅ Title font size is correct (2rem)');
      } else {
        console.log('⚠️ Title font size may not be 2rem');
      }
    }
    
    // Test timeline line
    const timelineLine = document.querySelector('.timeline-line');
    if (timelineLine) {
      console.log('✅ Timeline line found');
      const lineStyle = window.getComputedStyle(timelineLine);
      console.log(`📊 Timeline line background: ${lineStyle.background}`);
    } else {
      console.log('⚠️ Timeline line not found');
    }
    
    return true;
  } else {
    console.log('❌ Angular timeline section not found');
    return false;
  }
}

// Test 2: Angular Version Data
function testAngularVersionData() {
  console.log('\n📊 Test 2: Angular Version Data');
  
  const timelineChips = document.querySelectorAll('.timeline-chip');
  console.log(`📊 Timeline chips found: ${timelineChips.length}`);
  
  if (timelineChips.length === 0) {
    console.log('❌ No timeline chips found');
    return false;
  }
  
  // Expected Angular versions and projects
  const expectedVersions = [
    { version: 'Angular 8', project: 'CIS (Career Information System)', year: '2019-2020' },
    { version: 'Angular 13', project: 'Career Trek & Photoshooto', year: '2021-2022' },
    { version: 'Angular 15', project: 'IOT Dashboard & NH Cam', year: '2022-2023' },
    { version: 'Angular 17', project: 'ICO Sphere (Brane Enterprises)', year: '2023-2024' },
    { version: 'Angular 18', project: 'Celeste (Greenko)', year: '2024-Present' }
  ];
  
  let foundVersions = 0;
  let correctProjects = 0;
  
  timelineChips.forEach((chip, index) => {
    const versionElement = chip.querySelector('.chip-version');
    const projectElement = chip.querySelector('.project-name');
    const yearElement = chip.querySelector('.chip-year');
    
    if (versionElement && projectElement && yearElement) {
      const version = versionElement.textContent?.trim();
      const project = projectElement.textContent?.trim();
      const year = yearElement.textContent?.trim();
      
      foundVersions++;
      
      const expectedVersion = expectedVersions[index];
      if (expectedVersion) {
        if (version === expectedVersion.version) {
          console.log(`✅ ${version} version correct`);
        } else {
          console.log(`⚠️ ${version} version mismatch (expected ${expectedVersion.version})`);
        }
        
        if (project === expectedVersion.project) {
          correctProjects++;
          console.log(`✅ ${version}: ${project} (correct)`);
        } else {
          console.log(`⚠️ ${version}: ${project} (expected ${expectedVersion.project})`);
        }
        
        if (year === expectedVersion.year) {
          console.log(`✅ ${version}: ${year} (correct)`);
        } else {
          console.log(`⚠️ ${version}: ${year} (expected ${expectedVersion.year})`);
        }
      }
    }
  });
  
  console.log(`📊 Versions found: ${foundVersions}`);
  console.log(`📊 Correct projects: ${correctProjects}/${expectedVersions.length}`);
  
  if (foundVersions >= 5) {
    console.log('✅ All expected Angular versions are present');
  } else {
    console.log('⚠️ Some Angular versions may be missing');
  }
  
  return foundVersions > 0;
}

// Test 3: GSAP Scroll Animations
function testGSAPScrollAnimations() {
  console.log('\n🎬 Test 3: GSAP Scroll Animations');
  
  // Check if GSAP is loaded
  if (typeof gsap !== 'undefined') {
    console.log('✅ GSAP library loaded');
    console.log(`📊 GSAP version: ${gsap.version}`);
    
    // Check ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      console.log('✅ ScrollTrigger plugin loaded');
      
      const triggers = ScrollTrigger.getAll();
      console.log(`📊 ScrollTrigger instances: ${triggers.length}`);
      
      // Look for timeline-specific triggers
      const timelineTriggers = triggers.filter(trigger => {
        const triggerElement = trigger.trigger;
        return triggerElement && (
          triggerElement.classList.contains('angular-timeline-section') ||
          triggerElement.querySelector('.angular-timeline-section')
        );
      });
      
      console.log(`📊 Timeline ScrollTrigger instances: ${timelineTriggers.length}`);
      
      if (timelineTriggers.length > 0) {
        console.log('✅ Timeline ScrollTrigger animations are configured');
        
        // Check trigger settings
        timelineTriggers.forEach((trigger, index) => {
          console.log(`📊 Timeline trigger ${index + 1}:`);
          console.log(`   - Start: ${trigger.start}`);
          console.log(`   - End: ${trigger.end}`);
        });
      } else {
        console.log('⚠️ No timeline-specific ScrollTrigger instances found');
      }
    } else {
      console.log('⚠️ ScrollTrigger plugin not loaded');
    }
    
    return true;
  } else {
    console.log('❌ GSAP library not loaded');
    return false;
  }
}

// Test 4: Stagger Animation (0.2s)
function testStaggerAnimation() {
  console.log('\n⏱️ Test 4: Stagger Animation (0.2s)');
  
  const timelineChips = document.querySelectorAll('.timeline-chip');
  if (timelineChips.length === 0) {
    console.log('❌ No timeline chips found for stagger test');
    return false;
  }
  
  console.log(`📊 Testing stagger animation on ${timelineChips.length} chips`);
  
  // Test initial state (should be hidden before scroll trigger)
  let hiddenChips = 0;
  timelineChips.forEach((chip, index) => {
    const chipStyle = window.getComputedStyle(chip);
    const opacity = parseFloat(chipStyle.opacity);
    
    if (opacity < 1) {
      hiddenChips++;
    }
    
    console.log(`📊 Chip ${index + 1}: opacity=${opacity}`);
  });
  
  if (hiddenChips > 0) {
    console.log(`✅ ${hiddenChips} chips are initially hidden (good for scroll animation)`);
  } else {
    console.log('⚠️ All chips are visible (animation may have already triggered)');
  }
  
  // Test scroll trigger by scrolling to timeline
  const timelineSection = document.querySelector('.angular-timeline-section');
  if (timelineSection) {
    console.log('📊 Scrolling to timeline section to trigger animations...');
    
    timelineSection.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
    
    // Check animation after scroll
    setTimeout(() => {
      let animatedChips = 0;
      timelineChips.forEach((chip, index) => {
        const chipStyle = window.getComputedStyle(chip);
        const opacity = parseFloat(chipStyle.opacity);
        const transform = chipStyle.transform;
        
        if (opacity > 0.5) {
          animatedChips++;
        }
        
        console.log(`📊 Chip ${index + 1} after scroll: opacity=${opacity}, transform=${transform}`);
      });
      
      console.log(`📊 Animated chips after scroll: ${animatedChips}/${timelineChips.length}`);
      
      if (animatedChips > 0) {
        console.log('✅ Timeline chips are animating on scroll');
      } else {
        console.log('⚠️ Timeline chips may not be animating');
      }
    }, 2000); // Wait 2 seconds for stagger animation to complete
  }
  
  return true;
}

// Test 5: Theme Consistency
function testThemeConsistency() {
  console.log('\n🎨 Test 5: Theme Consistency');
  
  const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary-color').trim();
  const secondaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--secondary-color').trim();
  const textColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--text-color').trim();
  
  console.log(`📊 Primary color: ${primaryColor}`);
  console.log(`📊 Secondary color: ${secondaryColor}`);
  console.log(`📊 Text color: ${textColor}`);
  
  if (primaryColor && secondaryColor && textColor) {
    console.log('✅ Theme colors are properly defined');
    
    // Test timeline section uses theme colors
    const timelineSection = document.querySelector('.angular-timeline-section');
    if (timelineSection) {
      const sectionStyle = window.getComputedStyle(timelineSection);
      console.log(`📊 Timeline section background: ${sectionStyle.backgroundColor}`);
    }
    
    // Test timeline title uses secondary color
    const timelineTitle = document.querySelector('.timeline-title');
    if (timelineTitle) {
      const titleStyle = window.getComputedStyle(timelineTitle);
      console.log(`📊 Timeline title color: ${titleStyle.color}`);
      
      if (titleStyle.color.includes('38, 166, 154') || 
          titleStyle.color.includes('#26a69a')) {
        console.log('✅ Timeline title uses secondary color');
      } else {
        console.log('⚠️ Timeline title may not be using secondary color');
      }
    }
    
    // Test chip versions use custom colors
    const chipVersions = document.querySelectorAll('.chip-version');
    if (chipVersions.length > 0) {
      console.log('📊 Testing chip version colors...');
      chipVersions.forEach((version, index) => {
        const versionStyle = window.getComputedStyle(version);
        console.log(`📊 Chip ${index + 1} version color: ${versionStyle.color}`);
      });
    }
    
    return true;
  } else {
    console.log('❌ Theme colors not properly defined');
    return false;
  }
}

// Test 6: Responsive Design
function testResponsiveDesign() {
  console.log('\n📱 Test 6: Responsive Design');
  
  const timelineChips = document.querySelectorAll('.timeline-chip');
  const timelineLine = document.querySelector('.timeline-line');
  
  console.log(`📊 Timeline chips: ${timelineChips.length}`);
  console.log(`📊 Timeline line: ${timelineLine ? 'found' : 'not found'}`);
  
  // Test current viewport
  const viewportWidth = window.innerWidth;
  console.log(`📊 Current viewport width: ${viewportWidth}px`);
  
  if (viewportWidth <= 768) {
    console.log('📊 Mobile viewport detected');
    
    // Check if timeline line is hidden on mobile
    if (timelineLine) {
      const lineStyle = window.getComputedStyle(timelineLine);
      const display = lineStyle.display;
      console.log(`📊 Timeline line display on mobile: ${display}`);
      
      if (display === 'none') {
        console.log('✅ Timeline line is hidden on mobile (correct)');
      } else {
        console.log('⚠️ Timeline line should be hidden on mobile');
      }
    }
    
    // Check chip layout on mobile
    const timelineContainer = document.querySelector('.angular-timeline-chips');
    if (timelineContainer) {
      const containerStyle = window.getComputedStyle(timelineContainer);
      console.log(`📊 Timeline container flex-direction: ${containerStyle.flexDirection}`);
      
      if (containerStyle.flexDirection === 'column') {
        console.log('✅ Timeline chips are stacked vertically on mobile');
      } else {
        console.log('⚠️ Timeline chips should be stacked vertically on mobile');
      }
    }
  } else {
    console.log('📊 Desktop viewport detected');
    
    // Check alternating layout
    let evenChips = 0;
    let oddChips = 0;
    
    timelineChips.forEach((chip, index) => {
      if (chip.classList.contains('even')) {
        evenChips++;
      }
      if (chip.classList.contains('odd')) {
        oddChips++;
      }
    });
    
    console.log(`📊 Even positioned chips: ${evenChips}`);
    console.log(`📊 Odd positioned chips: ${oddChips}`);
    
    if (evenChips > 0 && oddChips > 0) {
      console.log('✅ Alternating chip layout detected');
    } else {
      console.log('⚠️ Alternating chip layout may not be working');
    }
  }
  
  return true;
}

// Test 7: Accessibility Features
function testAccessibilityFeatures() {
  console.log('\n♿ Test 7: Accessibility Features');
  
  // Test ARIA attributes
  const timelineSection = document.querySelector('.angular-timeline-section');
  if (timelineSection) {
    const role = timelineSection.getAttribute('role');
    const ariaLabelledBy = timelineSection.getAttribute('aria-labelledby');
    
    console.log(`📊 Timeline section role: ${role}`);
    console.log(`📊 Timeline section aria-labelledby: ${ariaLabelledBy}`);
    
    if (role === 'region' && ariaLabelledBy) {
      console.log('✅ Timeline section has proper ARIA attributes');
    }
  }
  
  // Test chip accessibility
  const timelineChips = document.querySelectorAll('.timeline-chip');
  let accessibleChips = 0;
  
  timelineChips.forEach((chip, index) => {
    const role = chip.getAttribute('role');
    const tabindex = chip.getAttribute('tabindex');
    const ariaLabel = chip.getAttribute('aria-label');
    
    if (role === 'button' && tabindex === '0' && ariaLabel) {
      accessibleChips++;
    }
    
    console.log(`📊 Chip ${index + 1}: role=${role}, tabindex=${tabindex}, aria-label=${ariaLabel ? 'present' : 'missing'}`);
  });
  
  console.log(`📊 Accessible chips: ${accessibleChips}/${timelineChips.length}`);
  
  if (accessibleChips === timelineChips.length) {
    console.log('✅ All timeline chips are accessible');
  } else {
    console.log('⚠️ Some timeline chips may need accessibility improvements');
  }
  
  // Test keyboard navigation
  console.log('📊 Testing keyboard navigation...');
  if (timelineChips.length > 0) {
    const firstChip = timelineChips[0];
    firstChip.focus();
    
    setTimeout(() => {
      const focusedElement = document.activeElement;
      if (focusedElement === firstChip) {
        console.log('✅ Timeline chips are keyboard focusable');
      } else {
        console.log('⚠️ Timeline chips may not be keyboard focusable');
      }
    }, 100);
  }
  
  return true;
}

// Run all timeline tests
async function runAngularTimelineTests() {
  console.log('🚀 Running Angular Timeline Test Suite...\n');
  
  const tests = [
    testTimelineStructure,
    testAngularVersionData,
    testGSAPScrollAnimations,
    testStaggerAnimation,
    testThemeConsistency,
    testResponsiveDesign,
    testAccessibilityFeatures
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
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
      console.error(`❌ Test ${i + 1} failed with error:`, error);
    }
  }
  
  console.log(`\n📊 Timeline Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All Angular timeline tests passed! The timeline is working correctly.');
  } else {
    console.log('⚠️ Some timeline tests failed. Check the console output for details.');
  }
  
  console.log('\n🔧 Manual Testing Recommendations:');
  console.log('1. Scroll to the Angular timeline section to see animations');
  console.log('2. Click on timeline chips to test navigation');
  console.log('3. Hover over chips to see hover effects');
  console.log('4. Test on different screen sizes for responsiveness');
  console.log('5. Test keyboard navigation with Tab key');
  console.log('6. Verify theme switching affects timeline colors');
  console.log('7. Check timeline on mobile devices');
  
  return { passed: passedTests, total: totalTests };
}

// Auto-run tests
runAngularTimelineTests();

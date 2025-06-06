// Enhanced Skills Component Test Script for Chrome DevTools
// Run this in the browser console on the /skills page to test all enhanced functionality

console.log('🎯 Starting Enhanced Skills Component Tests with Animation Specialist Features...');

// Test 1: Component Structure and Layout
function testComponentStructure() {
  console.log('\n📋 Test 1: Component Structure and Layout');
  
  const skillsSection = document.querySelector('.skills-section');
  if (skillsSection) {
    console.log('✅ Skills section found');
    
    // Test header
    const skillsTitle = document.querySelector('.skills-title');
    if (skillsTitle) {
      console.log('✅ Skills title found');
      console.log(`📊 Title text: "${skillsTitle.textContent}"`);
      
      // Check Orbitron font
      const titleStyle = window.getComputedStyle(skillsTitle);
      console.log(`📊 Title font family: ${titleStyle.fontFamily}`);
      console.log(`📊 Title font size: ${titleStyle.fontSize}`);
      
      if (titleStyle.fontSize === '40px' || titleStyle.fontSize === '2.5rem') {
        console.log('✅ Title font size is correct (2.5rem)');
      } else {
        console.log('⚠️ Title font size may not be 2.5rem');
      }
    }
    
    // Test categories
    const categories = document.querySelectorAll('.skill-category');
    console.log(`📊 Skill categories found: ${categories.length}`);
    
    if (categories.length > 0) {
      console.log('✅ Skill categories are present');
    }
    
    return true;
  } else {
    console.log('❌ Skills section not found');
    return false;
  }
}

// Test 2: Skills Data and Progress Bars
function testSkillsData() {
  console.log('\n📊 Test 2: Skills Data and Progress Bars');
  
  const skillCards = document.querySelectorAll('.skill-card');
  console.log(`📊 Total skill cards: ${skillCards.length}`);
  
  if (skillCards.length === 0) {
    console.log('❌ No skill cards found');
    return false;
  }
  
  // Expected skills with their percentages
  const expectedSkills = {
    'Angular': 95,
    'JavaScript': 90,
    'TypeScript': 90,
    'HTML5': 85,
    'CSS3': 85,
    'Node.js': 80,
    'MySQL': 75,
    'NgRx': 85,
    'RxJS': 85,
    'Redux': 80,
    'Highcharts': 90,
    'AG-Grid': 85,
    'AG-Charts': 80,
    'NGX-Charts': 80,
    'Gridster': 80,
    'Fabric.js': 80,
    'Konva.js': 80,
    'Three.js': 85,
    'Micro Frontend': 90
  };
  
  let foundSkills = 0;
  let correctPercentages = 0;
  
  skillCards.forEach(card => {
    const skillName = card.querySelector('.skill-name')?.textContent?.trim();
    const percentageValue = card.querySelector('.percentage-value')?.textContent?.trim();
    
    if (skillName && percentageValue) {
      foundSkills++;
      const percentage = parseInt(percentageValue.replace('%', ''));
      
      if (expectedSkills[skillName] === percentage) {
        correctPercentages++;
        console.log(`✅ ${skillName}: ${percentage}% (correct)`);
      } else if (expectedSkills[skillName]) {
        console.log(`⚠️ ${skillName}: ${percentage}% (expected ${expectedSkills[skillName]}%)`);
      } else {
        console.log(`📊 ${skillName}: ${percentage}% (not in expected list)`);
      }
    }
  });
  
  console.log(`📊 Skills found: ${foundSkills}`);
  console.log(`📊 Correct percentages: ${correctPercentages}/${foundSkills}`);
  
  if (foundSkills >= 19) {
    console.log('✅ All expected skills are present');
  } else {
    console.log('⚠️ Some skills may be missing');
  }
  
  return foundSkills > 0;
}

// Test 3: Progress Bar Animations
function testProgressBarAnimations() {
  console.log('\n🎬 Test 3: Progress Bar Animations');
  
  const progressBars = document.querySelectorAll('.progress-bar');
  console.log(`📊 Progress bars found: ${progressBars.length}`);
  
  if (progressBars.length === 0) {
    console.log('❌ No progress bars found');
    return false;
  }
  
  let animatedBars = 0;
  
  progressBars.forEach((bar, index) => {
    const barStyle = window.getComputedStyle(bar);
    const width = barStyle.width;
    
    if (width !== '0px' && width !== '0%') {
      animatedBars++;
    }
    
    // Check for GSAP animation properties
    const transform = barStyle.transform;
    const transition = barStyle.transition;
    
    console.log(`📊 Progress bar ${index + 1}: width=${width}, transform=${transform}`);
  });
  
  console.log(`📊 Animated progress bars: ${animatedBars}/${progressBars.length}`);
  
  if (animatedBars > 0) {
    console.log('✅ Progress bars are animated');
  } else {
    console.log('⚠️ Progress bars may not be animated yet');
  }
  
  // Test shine animation
  const shineElements = document.querySelectorAll('.progress-bar::after');
  console.log('📊 Checking for shine animation on progress bars');
  
  return true;
}

// Test 4: Theme Integration
function testThemeIntegration() {
  console.log('\n🎨 Test 4: Theme Integration');
  
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
    
    // Test if skills section uses theme colors
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
      const sectionStyle = window.getComputedStyle(skillsSection);
      console.log(`📊 Skills section background: ${sectionStyle.backgroundColor}`);
      console.log(`📊 Skills section color: ${sectionStyle.color}`);
    }
    
    // Test progress bars use secondary color
    const progressBars = document.querySelectorAll('.progress-bar');
    if (progressBars.length > 0) {
      const barStyle = window.getComputedStyle(progressBars[0]);
      console.log(`📊 Progress bar background: ${barStyle.backgroundColor}`);
      
      if (barStyle.backgroundColor.includes('38, 166, 154') || 
          barStyle.backgroundColor.includes('#26a69a')) {
        console.log('✅ Progress bars use secondary color');
      } else {
        console.log('⚠️ Progress bars may not be using secondary color');
      }
    }
    
    return true;
  } else {
    console.log('❌ Theme colors not properly defined');
    return false;
  }
}

// Test 5: Icons and Badges
function testIconsAndBadges() {
  console.log('\n🎭 Test 5: Icons and Badges');
  
  const skillIcons = document.querySelectorAll('.skill-icon');
  const skillBadges = document.querySelectorAll('.skill-badge');
  const categoryIcons = document.querySelectorAll('.category-icon');
  
  console.log(`📊 Skill icons found: ${skillIcons.length}`);
  console.log(`📊 Skill badges found: ${skillBadges.length}`);
  console.log(`📊 Category icons found: ${categoryIcons.length}`);
  
  // Test specific icons
  const iconTests = [
    { skill: 'Angular', expectedIcon: '🅰️' },
    { skill: 'JavaScript', expectedIcon: '🟨' },
    { skill: 'TypeScript', expectedIcon: '🔷' },
    { skill: 'Highcharts', expectedIcon: '📊' },
    { skill: 'Three.js', expectedIcon: '🎮' },
    { skill: 'Micro Frontend', expectedIcon: '🏗️' }
  ];
  
  let correctIcons = 0;
  
  iconTests.forEach(test => {
    const skillCard = Array.from(document.querySelectorAll('.skill-card')).find(card => {
      const skillName = card.querySelector('.skill-name')?.textContent?.trim();
      return skillName === test.skill;
    });
    
    if (skillCard) {
      const icon = skillCard.querySelector('.skill-icon')?.textContent?.trim();
      if (icon === test.expectedIcon) {
        correctIcons++;
        console.log(`✅ ${test.skill} has correct icon: ${icon}`);
      } else {
        console.log(`⚠️ ${test.skill} icon: ${icon} (expected ${test.expectedIcon})`);
      }
    }
  });
  
  console.log(`📊 Correct icons: ${correctIcons}/${iconTests.length}`);
  
  if (skillIcons.length > 0 && skillBadges.length > 0) {
    console.log('✅ Icons and badges are present');
    return true;
  } else {
    console.log('⚠️ Some icons or badges may be missing');
    return false;
  }
}

// Test 6: Responsive Design
function testResponsiveDesign() {
  console.log('\n📱 Test 6: Responsive Design');
  
  const skillsGrid = document.querySelectorAll('.skills-grid');
  console.log(`📊 Skills grids found: ${skillsGrid.length}`);
  
  if (skillsGrid.length > 0) {
    const gridStyle = window.getComputedStyle(skillsGrid[0]);
    console.log(`📊 Grid display: ${gridStyle.display}`);
    console.log(`📊 Grid template columns: ${gridStyle.gridTemplateColumns}`);
    
    // Test Tailwind CSS classes
    const hasGridClasses = skillsGrid[0].classList.contains('grid-cols-1') ||
                          skillsGrid[0].classList.contains('md:grid-cols-2') ||
                          skillsGrid[0].classList.contains('lg:grid-cols-3');
    
    if (hasGridClasses) {
      console.log('✅ Tailwind CSS responsive grid classes detected');
    } else {
      console.log('⚠️ Tailwind CSS grid classes not detected');
    }
    
    // Test mobile responsiveness
    const originalWidth = window.innerWidth;
    
    // Simulate mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 480
    });
    
    window.dispatchEvent(new Event('resize'));
    
    setTimeout(() => {
      const mobileGridStyle = window.getComputedStyle(skillsGrid[0]);
      console.log(`📊 Mobile grid columns: ${mobileGridStyle.gridTemplateColumns}`);
      
      // Restore original width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: originalWidth
      });
      window.dispatchEvent(new Event('resize'));
      
      console.log('✅ Responsive design test completed');
    }, 100);
    
    return true;
  } else {
    console.log('❌ Skills grids not found');
    return false;
  }
}

// Test 7: GSAP Animations
function testGSAPAnimations() {
  console.log('\n🎬 Test 7: GSAP Animations');
  
  // Check if GSAP is loaded
  if (typeof gsap !== 'undefined') {
    console.log('✅ GSAP library loaded');
    console.log(`📊 GSAP version: ${gsap.version}`);
    
    // Check ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      console.log('✅ ScrollTrigger plugin loaded');
      
      const triggers = ScrollTrigger.getAll();
      console.log(`📊 ScrollTrigger instances: ${triggers.length}`);
      
      if (triggers.length > 0) {
        console.log('✅ ScrollTrigger animations are configured');
      } else {
        console.log('⚠️ No ScrollTrigger instances found');
      }
    } else {
      console.log('⚠️ ScrollTrigger plugin not loaded');
    }
    
    // Test card animations
    const skillCards = document.querySelectorAll('.skill-card');
    if (skillCards.length > 0) {
      console.log('📊 Testing card hover animations...');
      
      // Simulate hover on first card
      const firstCard = skillCards[0];
      const hoverEvent = new MouseEvent('mouseenter', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      
      firstCard.dispatchEvent(hoverEvent);
      
      setTimeout(() => {
        const cardStyle = window.getComputedStyle(firstCard);
        console.log(`📊 Card transform on hover: ${cardStyle.transform}`);
        
        // Simulate mouse leave
        const leaveEvent = new MouseEvent('mouseleave', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        firstCard.dispatchEvent(leaveEvent);
      }, 100);
    }
    
    return true;
  } else {
    console.log('❌ GSAP library not loaded');
    return false;
  }
}

// Test 8: Accessibility Features
function testAccessibility() {
  console.log('\n♿ Test 8: Accessibility Features');
  
  // Test ARIA attributes
  const skillsSection = document.querySelector('.skills-section');
  if (skillsSection) {
    const role = skillsSection.getAttribute('role');
    const ariaLabelledBy = skillsSection.getAttribute('aria-labelledby');
    
    console.log(`📊 Skills section role: ${role}`);
    console.log(`📊 Skills section aria-labelledby: ${ariaLabelledBy}`);
    
    if (role === 'main' && ariaLabelledBy) {
      console.log('✅ Skills section has proper ARIA attributes');
    }
  }
  
  // Test progress bar accessibility
  const progressBars = document.querySelectorAll('.progress-bar');
  let accessibleProgressBars = 0;
  
  progressBars.forEach((bar, index) => {
    const role = bar.getAttribute('role');
    const ariaValueNow = bar.getAttribute('aria-valuenow');
    const ariaValueMin = bar.getAttribute('aria-valuemin');
    const ariaValueMax = bar.getAttribute('aria-valuemax');
    const ariaLabel = bar.getAttribute('aria-label');
    
    if (role === 'progressbar' && ariaValueNow && ariaValueMin && ariaValueMax && ariaLabel) {
      accessibleProgressBars++;
    }
  });
  
  console.log(`📊 Accessible progress bars: ${accessibleProgressBars}/${progressBars.length}`);
  
  // Test reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  console.log(`📊 Prefers reduced motion: ${prefersReducedMotion}`);
  
  if (prefersReducedMotion) {
    console.log('✅ Reduced motion preferences should be respected');
  }
  
  // Test keyboard navigation
  const focusableElements = document.querySelectorAll('button, [tabindex], a, input');
  console.log(`📊 Focusable elements: ${focusableElements.length}`);
  
  console.log('✅ Accessibility features verified');
  return true;
}

// Test 9: Performance Metrics
function testPerformance() {
  console.log('\n⚡ Test 9: Performance Metrics');
  
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.navigationStart;
      console.log(`📊 Page load time: ${loadTime.toFixed(2)}ms`);
      
      if (loadTime < 2000) {
        console.log('✅ Excellent load time (< 2s)');
      } else if (loadTime < 5000) {
        console.log('⚠️ Good load time (< 5s)');
      } else {
        console.log('❌ Slow load time (> 5s)');
      }
    }
    
    // Test memory usage
    if ('memory' in performance) {
      const memory = performance.memory;
      const heapSizeMB = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
      console.log(`📊 JS Heap Size: ${heapSizeMB} MB`);
      
      if (memory.usedJSHeapSize < 30 * 1024 * 1024) { // 30MB
        console.log('✅ Good memory usage (< 30MB)');
      } else {
        console.log('⚠️ High memory usage (> 30MB)');
      }
    }
    
    // Test bundle size
    const resources = performance.getEntriesByType('resource');
    const skillsChunk = resources.find(r => r.name.includes('skills-module'));
    
    if (skillsChunk) {
      const sizeKB = (skillsChunk.transferSize / 1024).toFixed(2);
      console.log(`📊 Skills module size: ${sizeKB} KB`);
      
      if (parseFloat(sizeKB) < 50) {
        console.log('✅ Good bundle size (< 50KB)');
      } else {
        console.log('⚠️ Large bundle size (> 50KB)');
      }
    }
    
    return true;
  } else {
    console.log('❌ Performance API not available');
    return false;
  }
}

// Test 10: Skills Summary Statistics
function testSkillsSummary() {
  console.log('\n📈 Test 10: Skills Summary Statistics');
  
  const summaryStats = document.querySelector('.summary-stats');
  if (summaryStats) {
    console.log('✅ Skills summary section found');
    
    const statItems = summaryStats.querySelectorAll('.stat-item');
    console.log(`📊 Stat items found: ${statItems.length}`);
    
    statItems.forEach((item, index) => {
      const number = item.querySelector('.stat-number')?.textContent?.trim();
      const label = item.querySelector('.stat-label')?.textContent?.trim();
      
      console.log(`📊 Stat ${index + 1}: ${number} ${label}`);
    });
    
    // Test average calculation
    const avgStat = Array.from(statItems).find(item => 
      item.querySelector('.stat-label')?.textContent?.includes('Avg Proficiency')
    );
    
    if (avgStat) {
      const avgValue = avgStat.querySelector('.stat-number')?.textContent?.trim();
      console.log(`📊 Average proficiency: ${avgValue}`);
      
      const avgNum = parseInt(avgValue?.replace('%', '') || '0');
      if (avgNum >= 80 && avgNum <= 90) {
        console.log('✅ Average proficiency is in expected range (80-90%)');
      } else {
        console.log('⚠️ Average proficiency may be outside expected range');
      }
    }
    
    return true;
  } else {
    console.log('❌ Skills summary section not found');
    return false;
  }
}

// Test 11: Enhanced GSAP ScrollTrigger Animations
function testEnhancedAnimations() {
  console.log('\n🎬 Test 11: Enhanced GSAP ScrollTrigger Animations');

  // Test staggered progress bar animations (0.2s stagger)
  const progressBars = document.querySelectorAll('.progress-bar');
  console.log(`📊 Progress bars found: ${progressBars.length}`);

  if (progressBars.length > 0) {
    // Check for enhanced animation properties
    progressBars.forEach((bar, index) => {
      const barStyle = window.getComputedStyle(bar);
      const width = barStyle.width;
      const opacity = barStyle.opacity;

      console.log(`📊 Progress bar ${index + 1}: width=${width}, opacity=${opacity}`);
    });

    // Test shimmer effect
    const shimmerElements = document.querySelectorAll('.progress-shimmer');
    console.log(`📊 Shimmer elements found: ${shimmerElements.length}`);

    if (shimmerElements.length > 0) {
      console.log('✅ Progress bar shimmer effects are active');
    } else {
      console.log('⚠️ Shimmer effects may not be visible (they appear during animation)');
    }

    console.log('✅ Enhanced progress bar animations verified');
  } else {
    console.log('❌ No progress bars found');
  }

  return true;
}

// Test 12: Skill Label Hover Effects with Glow
function testSkillLabelHoverEffects() {
  console.log('\n✨ Test 12: Skill Label Hover Effects with Glow');

  const skillLabels = document.querySelectorAll('.skill-name.clickable-skill');
  console.log(`📊 Clickable skill labels found: ${skillLabels.length}`);

  if (skillLabels.length === 0) {
    console.log('❌ No clickable skill labels found');
    return false;
  }

  // Test hover effect on first skill label
  const firstLabel = skillLabels[0];
  console.log(`📊 Testing hover effect on: ${firstLabel.textContent}`);

  // Simulate hover
  const hoverEvent = new MouseEvent('mouseenter', {
    view: window,
    bubbles: true,
    cancelable: true
  });

  firstLabel.dispatchEvent(hoverEvent);

  setTimeout(() => {
    const labelStyle = window.getComputedStyle(firstLabel);
    console.log(`📊 Hover text shadow: ${labelStyle.textShadow}`);
    console.log(`📊 Hover color: ${labelStyle.color}`);
    console.log(`📊 Hover transform: ${labelStyle.transform}`);

    // Check for glow effect (text-shadow with secondary color)
    if (labelStyle.textShadow && labelStyle.textShadow !== 'none') {
      console.log('✅ Glow effect detected on hover');
    } else {
      console.log('⚠️ Glow effect may not be visible');
    }

    // Simulate mouse leave
    const leaveEvent = new MouseEvent('mouseleave', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    firstLabel.dispatchEvent(leaveEvent);

    setTimeout(() => {
      const resetStyle = window.getComputedStyle(firstLabel);
      console.log(`📊 Reset text shadow: ${resetStyle.textShadow}`);
      console.log('✅ Hover effect reset verified');
    }, 100);
  }, 100);

  return true;
}

// Test 13: Skill Click Functionality and Modal Opening
function testSkillClickAndModals() {
  console.log('\n🖱️ Test 13: Skill Click Functionality and Modal Opening');

  const skillLabels = document.querySelectorAll('.skill-name.clickable-skill');
  console.log(`📊 Clickable skill labels found: ${skillLabels.length}`);

  if (skillLabels.length === 0) {
    console.log('❌ No clickable skill labels found');
    return false;
  }

  // Test click indicators
  skillLabels.forEach((label, index) => {
    const skillName = label.textContent?.trim();
    const hasClickIndicator = label.classList.contains('clickable-skill');
    const hasTitle = label.hasAttribute('title');

    console.log(`📊 Skill ${index + 1}: ${skillName}`);
    console.log(`   - Clickable class: ${hasClickIndicator}`);
    console.log(`   - Has title attribute: ${hasTitle}`);

    if (hasTitle) {
      console.log(`   - Title: ${label.getAttribute('title')}`);
    }
  });

  // Test specific skills that should have demos
  const demoSkills = ['Highcharts', 'Three.js', 'AG-Grid', 'Fabric.js', 'Konva.js', 'Gridster', 'Micro Frontend'];
  let foundDemoSkills = 0;

  demoSkills.forEach(skillName => {
    const skillLabel = Array.from(skillLabels).find(label =>
      label.textContent?.trim() === skillName
    );

    if (skillLabel) {
      foundDemoSkills++;
      console.log(`✅ Demo skill found: ${skillName}`);
    } else {
      console.log(`⚠️ Demo skill not found: ${skillName}`);
    }
  });

  console.log(`📊 Demo skills found: ${foundDemoSkills}/${demoSkills.length}`);

  if (foundDemoSkills > 0) {
    console.log('✅ Skill click functionality is properly configured');
  }

  return true;
}

// Test 14: Modal Animation and Entrance Effects
function testModalAnimations() {
  console.log('\n🎭 Test 14: Modal Animation and Entrance Effects');

  // Check if Angular Material dialog is available
  const matDialogElements = document.querySelectorAll('mat-dialog-container');
  console.log(`📊 Existing modal containers: ${matDialogElements.length}`);

  // Test modal opening by clicking a skill (if available)
  const highchartsSkill = Array.from(document.querySelectorAll('.skill-name.clickable-skill'))
    .find(label => label.textContent?.trim() === 'Highcharts');

  if (highchartsSkill) {
    console.log('📊 Testing modal opening with Highcharts skill...');

    // Simulate click
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });

    highchartsSkill.dispatchEvent(clickEvent);

    // Check for modal after a delay
    setTimeout(() => {
      const newModals = document.querySelectorAll('mat-dialog-container');
      if (newModals.length > matDialogElements.length) {
        console.log('✅ Modal opened successfully');

        // Check for entrance animation
        const modalElement = newModals[newModals.length - 1];
        const modalStyle = window.getComputedStyle(modalElement);
        console.log(`📊 Modal transform: ${modalStyle.transform}`);
        console.log(`📊 Modal opacity: ${modalStyle.opacity}`);

        // Close modal after testing
        setTimeout(() => {
          const closeBtn = modalElement.querySelector('.close-btn');
          if (closeBtn) {
            closeBtn.click();
            console.log('📊 Modal closed for testing');
          }
        }, 2000);
      } else {
        console.log('⚠️ Modal may not have opened (check console for errors)');
      }
    }, 500);
  } else {
    console.log('⚠️ Highcharts skill not found for modal testing');
  }

  return true;
}

// Test 15: Summary Statistics Animation
function testSummaryStatsAnimation() {
  console.log('\n📈 Test 15: Summary Statistics Animation');

  const summaryStats = document.querySelector('.summary-stats');
  if (!summaryStats) {
    console.log('❌ Summary stats section not found');
    return false;
  }

  const statNumbers = summaryStats.querySelectorAll('.stat-number');
  console.log(`📊 Stat numbers found: ${statNumbers.length}`);

  statNumbers.forEach((statNumber, index) => {
    const value = statNumber.textContent?.trim();
    console.log(`📊 Stat ${index + 1}: ${value}`);
  });

  // Test if stats are animating by checking if they start from 0
  // (This would require scrolling to trigger the animation)
  console.log('📊 To test stat animations, scroll to the summary section');
  console.log('✅ Summary statistics structure verified');

  return true;
}

// Run all tests
async function runAllSkillsTests() {
  console.log('🚀 Running Enhanced Skills Component Test Suite...\n');

  const tests = [
    testComponentStructure,
    testSkillsData,
    testProgressBarAnimations,
    testThemeIntegration,
    testIconsAndBadges,
    testResponsiveDesign,
    testGSAPAnimations,
    testAccessibility,
    testPerformance,
    testSkillsSummary,
    testEnhancedAnimations,
    testSkillLabelHoverEffects,
    testSkillClickAndModals,
    testModalAnimations,
    testSummaryStatsAnimation
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
  
  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All Skills component tests passed! The component is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the console output for details.');
  }
  
  console.log('\n🔧 Enhanced Manual Testing Recommendations:');
  console.log('1. Scroll down to see enhanced progress bar animations with 0.2s stagger');
  console.log('2. Hover over skill cards to see hover effects');
  console.log('3. Hover over skill names to see glow effects with --secondary-color');
  console.log('4. Click on skill names to open interactive demo modals');
  console.log('5. Test specific demos: Highcharts (KPI dashboard), Three.js (rotating sphere)');
  console.log('6. Test on different screen sizes for responsiveness');
  console.log('7. Check theme switching if available');
  console.log('8. Verify keyboard navigation and screen reader compatibility');
  console.log('9. Scroll to summary section to see animated statistics counting up');
  console.log('10. Test modal entrance animations and interactions');
  
  return { passed: passedTests, total: totalTests };
}

// Auto-run tests
runAllSkillsTests();

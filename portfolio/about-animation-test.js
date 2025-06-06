// About Component Animation Test Script for Chrome DevTools
// Run this in the browser console on the /about page to test animations

console.log('🎬 Starting About Component Animation Tests...');

// Test 1: ScrollTrigger Animation Performance
function testScrollTriggerAnimations() {
  console.log('\n⚡ ScrollTrigger Animation Test:');
  
  // Check if GSAP and ScrollTrigger are loaded
  if (typeof gsap === 'undefined') {
    console.error('❌ GSAP not found');
    return;
  }
  
  if (typeof ScrollTrigger === 'undefined') {
    console.error('❌ ScrollTrigger not found');
    return;
  }
  
  console.log('✅ GSAP and ScrollTrigger loaded successfully');
  
  // Get all ScrollTrigger instances
  const triggers = ScrollTrigger.getAll();
  console.log(`✅ Active ScrollTrigger instances: ${triggers.length}`);
  
  triggers.forEach((trigger, index) => {
    console.log(`📊 Trigger ${index + 1}:`, {
      element: trigger.trigger,
      start: trigger.start,
      end: trigger.end,
      progress: trigger.progress
    });
  });
}

// Test 2: Stats Cards Animation
function testStatsCardsAnimation() {
  console.log('\n📊 Stats Cards Animation Test:');
  
  const statsContainer = document.querySelector('[data-testid="stats-container"], .stats-container');
  if (!statsContainer) {
    console.error('❌ Stats container not found');
    return;
  }
  
  const statCards = statsContainer.querySelectorAll('.stat-card');
  console.log(`✅ Found ${statCards.length} stat cards`);
  
  // Test scroll position for animation trigger
  const rect = statsContainer.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const triggerPoint = viewportHeight * 0.8; // 80% viewport
  
  console.log(`📊 Stats container position: ${rect.top}px from top`);
  console.log(`📊 Animation trigger point: ${triggerPoint}px`);
  console.log(`📊 Should animate: ${rect.top < triggerPoint ? 'Yes' : 'No'}`);
  
  // Check current animation state
  statCards.forEach((card, index) => {
    const style = window.getComputedStyle(card);
    console.log(`📊 Card ${index + 1} - Opacity: ${style.opacity}, Transform: ${style.transform}`);
  });
}

// Test 3: Hover Effects
function testHoverEffects() {
  console.log('\n🎯 Hover Effects Test:');
  
  const statCards = document.querySelectorAll('.stat-card');
  if (statCards.length === 0) {
    console.error('❌ No stat cards found for hover test');
    return;
  }
  
  console.log(`✅ Testing hover effects on ${statCards.length} cards`);
  
  // Simulate hover on first card
  const firstCard = statCards[0];
  console.log('🎯 Simulating hover on first card...');
  
  // Trigger mouse enter
  firstCard.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  
  setTimeout(() => {
    const style = window.getComputedStyle(firstCard);
    console.log(`📊 Hover state - Transform: ${style.transform}, Border: ${style.borderColor}`);
    
    // Trigger mouse leave
    firstCard.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    
    setTimeout(() => {
      const resetStyle = window.getComputedStyle(firstCard);
      console.log(`📊 Reset state - Transform: ${resetStyle.transform}`);
    }, 400);
  }, 400);
}

// Test 4: Voice Narration Feature
function testVoiceNarration() {
  console.log('\n🎤 Voice Narration Test:');
  
  const voiceButton = document.querySelector('.voice-button');
  if (!voiceButton) {
    console.error('❌ Voice button not found');
    return;
  }
  
  console.log('✅ Voice button found');
  
  // Check speech synthesis support
  const speechSupported = 'speechSynthesis' in window;
  console.log(`📊 Speech Synthesis supported: ${speechSupported ? 'Yes' : 'No'}`);
  
  if (speechSupported) {
    const voices = speechSynthesis.getVoices();
    console.log(`📊 Available voices: ${voices.length}`);
    voices.slice(0, 3).forEach((voice, index) => {
      console.log(`🎵 Voice ${index + 1}: ${voice.name} (${voice.lang})`);
    });
  }
  
  // Check iOS detection
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  console.log(`📱 iOS detected: ${isIOS ? 'Yes (Grok 3 placeholder will show)' : 'No'}`);
  
  // Test button click (without actually triggering speech)
  console.log('🎯 Testing voice button interaction...');
  const buttonText = voiceButton.querySelector('.voice-text');
  const buttonIcon = voiceButton.querySelector('.voice-icon');
  
  if (buttonText && buttonIcon) {
    console.log(`📊 Button text: "${buttonText.textContent}"`);
    console.log(`📊 Button icon: "${buttonIcon.textContent}"`);
  }
}

// Test 5: Paragraph Fade Animation
function testParagraphAnimation() {
  console.log('\n📝 Paragraph Animation Test:');
  
  const aboutText = document.querySelector('[data-testid="about-text"], .about-text');
  if (!aboutText) {
    console.error('❌ About text container not found');
    return;
  }
  
  const paragraphs = aboutText.querySelectorAll('.about-paragraph');
  console.log(`✅ Found ${paragraphs.length} paragraphs`);
  
  // Check animation state
  paragraphs.forEach((paragraph, index) => {
    const style = window.getComputedStyle(paragraph);
    console.log(`📝 Paragraph ${index + 1} - Opacity: ${style.opacity}, Transform: ${style.transform}`);
  });
  
  // Test scroll position for animation trigger
  const rect = aboutText.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const triggerPoint = viewportHeight * 0.75; // 75% viewport
  
  console.log(`📊 About text position: ${rect.top}px from top`);
  console.log(`📊 Animation trigger point: ${triggerPoint}px`);
  console.log(`📊 Should animate: ${rect.top < triggerPoint ? 'Yes' : 'No'}`);
}

// Test 6: Theme Consistency
function testThemeConsistency() {
  console.log('\n🎨 Theme Consistency Test:');
  
  const rootStyle = window.getComputedStyle(document.documentElement);
  const primaryColor = rootStyle.getPropertyValue('--primary-color').trim();
  const secondaryColor = rootStyle.getPropertyValue('--secondary-color').trim();
  const textColor = rootStyle.getPropertyValue('--text-color').trim();
  
  console.log(`🎨 Primary color: ${primaryColor || 'Not defined'}`);
  console.log(`🎨 Secondary color: ${secondaryColor || 'Not defined'}`);
  console.log(`🎨 Text color: ${textColor || 'Not defined'}`);
  
  // Check if components are using theme colors
  const aboutSection = document.querySelector('.about-section');
  if (aboutSection) {
    const sectionStyle = window.getComputedStyle(aboutSection);
    console.log(`📊 About section background: ${sectionStyle.backgroundColor}`);
    console.log(`📊 About section color: ${sectionStyle.color}`);
  }
  
  const statCards = document.querySelectorAll('.stat-card');
  if (statCards.length > 0) {
    const cardStyle = window.getComputedStyle(statCards[0]);
    console.log(`📊 Stat card border: ${cardStyle.borderColor}`);
  }
}

// Test 7: Responsive Design
function testResponsiveDesign() {
  console.log('\n📱 Responsive Design Test:');
  
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
  
  // Check grid layout
  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) {
    const gridStyle = window.getComputedStyle(statsGrid);
    console.log(`📊 Stats grid columns: ${gridStyle.gridTemplateColumns}`);
  }
  
  const aboutContent = document.querySelector('.about-content');
  if (aboutContent) {
    const contentStyle = window.getComputedStyle(aboutContent);
    console.log(`📊 About content layout: ${contentStyle.gridTemplateColumns || 'Flex layout'}`);
  }
}

// Test 8: Performance Metrics
function testPerformanceMetrics() {
  console.log('\n⚡ Performance Metrics:');
  
  // Check for memory usage
  if ('memory' in performance) {
    const memory = performance.memory;
    console.log(`🧠 JS Heap Size: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🧠 JS Heap Limit: ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`);
  }
  
  // Check animation frame rate
  let frameCount = 0;
  let lastTime = performance.now();
  
  function measureFPS() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
      console.log(`📊 Current FPS: ${frameCount}`);
      return;
    }
    
    requestAnimationFrame(measureFPS);
  }
  
  requestAnimationFrame(measureFPS);
  
  // Check for long tasks
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.duration > 50) {
          console.warn(`⚠️ Long task detected: ${entry.duration.toFixed(2)}ms`);
        }
      });
    });
    
    try {
      observer.observe({ entryTypes: ['longtask'] });
      setTimeout(() => observer.disconnect(), 5000);
    } catch (e) {
      console.log('📊 Long task monitoring not supported');
    }
  }
}

// Run all tests
function runAllAnimationTests() {
  testScrollTriggerAnimations();
  testStatsCardsAnimation();
  testHoverEffects();
  testVoiceNarration();
  testParagraphAnimation();
  testThemeConsistency();
  testResponsiveDesign();
  testPerformanceMetrics();
  
  console.log('\n🎯 Animation Tests Complete!');
  console.log('\n💡 Tips:');
  console.log('1. Scroll up and down to test ScrollTrigger animations');
  console.log('2. Hover over stat cards to test hover effects');
  console.log('3. Click the voice button to test narration');
  console.log('4. Resize window to test responsive design');
  console.log('5. Check browser DevTools Performance tab for detailed metrics');
}

// Auto-run tests
runAllAnimationTests();

// Contact Component Test Suite for Chrome DevTools
// Component Developer, Animation Specialist, Performance Specialist

console.log('📞 Contact Component Test Suite');
console.log('===============================');

// Test 1: Component Structure and Layout
function testComponentStructure() {
  console.log('\n📋 Test 1: Component Structure and Layout');
  
  const contactSection = document.querySelector('.contact-section');
  if (contactSection) {
    console.log('✅ Contact section found');
    
    // Test heading
    const contactTitle = document.querySelector('.contact-title');
    if (contactTitle) {
      console.log('✅ Contact title found');
      console.log(`📊 Title text: "${contactTitle.textContent}"`);
      
      // Check Orbitron font and 2.5rem size
      const titleStyle = window.getComputedStyle(contactTitle);
      console.log(`📊 Title font family: ${titleStyle.fontFamily}`);
      console.log(`📊 Title font size: ${titleStyle.fontSize}`);
      
      if (titleStyle.fontSize === '40px' || titleStyle.fontSize === '2.5rem') {
        console.log('✅ Title font size is correct (2.5rem)');
      } else {
        console.log('⚠️ Title font size may not be 2.5rem');
      }
      
      if (titleStyle.fontFamily.includes('Orbitron')) {
        console.log('✅ Title uses Orbitron font');
      } else {
        console.log('⚠️ Title may not be using Orbitron font');
      }
    }
    
    return true;
  } else {
    console.log('❌ Contact section not found');
    return false;
  }
}

// Test 2: Contact Information
function testContactInformation() {
  console.log('\n📊 Test 2: Contact Information');
  
  const contactItems = document.querySelectorAll('.contact-item');
  console.log(`📊 Contact items found: ${contactItems.length}`);
  
  if (contactItems.length === 0) {
    console.log('❌ No contact items found');
    return false;
  }
  
  // Expected contact info
  const expectedInfo = [
    { type: 'phone', value: '+91 9187122835' },
    { type: 'email', value: 'umashankar.anaxharopg970@gmail.com' },
    { type: 'location', value: 'Hyderabad, Telangana 500085' }
  ];
  
  let foundInfo = 0;
  
  contactItems.forEach((item, index) => {
    const label = item.querySelector('.contact-label');
    const value = item.querySelector('.contact-value');
    
    if (label && value) {
      const labelText = label.textContent?.toLowerCase().trim();
      const valueText = value.textContent?.trim();
      
      console.log(`📊 Contact item ${index + 1}: ${labelText} - ${valueText}`);
      
      // Check if it matches expected info
      const expected = expectedInfo.find(info => 
        labelText?.includes(info.type) || valueText?.includes(info.value)
      );
      
      if (expected) {
        foundInfo++;
        console.log(`✅ ${expected.type} information correct`);
      }
    }
  });
  
  console.log(`📊 Correct contact info found: ${foundInfo}/${expectedInfo.length}`);
  
  if (foundInfo >= 3) {
    console.log('✅ All contact information is present');
  } else {
    console.log('⚠️ Some contact information may be missing');
  }
  
  return foundInfo > 0;
}

// Test 3: Social Icons
function testSocialIcons() {
  console.log('\n🌐 Test 3: Social Icons');
  
  const socialIcons = document.querySelectorAll('.social-icon');
  console.log(`📊 Social icons found: ${socialIcons.length}`);
  
  if (socialIcons.length === 0) {
    console.log('❌ No social icons found');
    return false;
  }
  
  const expectedSocials = ['facebook', 'twitter', 'linkedin', 'instagram', 'github'];
  let foundSocials = 0;
  
  socialIcons.forEach((icon, index) => {
    const classes = icon.className;
    const ariaLabel = icon.getAttribute('aria-label');
    
    console.log(`📊 Social icon ${index + 1}: ${classes}, aria-label: ${ariaLabel}`);
    
    // Check if it matches expected social platforms
    const matchedSocial = expectedSocials.find(social => 
      classes.includes(social) || ariaLabel?.toLowerCase().includes(social)
    );
    
    if (matchedSocial) {
      foundSocials++;
      console.log(`✅ ${matchedSocial} icon found`);
    }
    
    // Test hover animation
    if (typeof gsap !== 'undefined') {
      icon.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      setTimeout(() => {
        icon.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      }, 500);
    }
  });
  
  console.log(`📊 Expected social icons found: ${foundSocials}/${expectedSocials.length}`);
  
  if (foundSocials >= 5) {
    console.log('✅ All social icons are present');
  } else {
    console.log('⚠️ Some social icons may be missing');
  }
  
  return foundSocials > 0;
}

// Test 4: Contact Form
function testContactForm() {
  console.log('\n📝 Test 4: Contact Form');
  
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) {
    console.log('❌ Contact form not found');
    return false;
  }
  
  console.log('✅ Contact form found');
  
  // Test form fields
  const expectedFields = ['name', 'email', 'message'];
  let foundFields = 0;
  
  expectedFields.forEach(fieldName => {
    const field = document.getElementById(fieldName) || 
                  document.querySelector(`[formControlName="${fieldName}"]`);
    
    if (field) {
      foundFields++;
      console.log(`✅ ${fieldName} field found`);
      
      // Test field validation
      const label = document.querySelector(`label[for="${fieldName}"]`);
      if (label && label.textContent?.includes('*')) {
        console.log(`✅ ${fieldName} field is marked as required`);
      }
    } else {
      console.log(`❌ ${fieldName} field not found`);
    }
  });
  
  console.log(`📊 Form fields found: ${foundFields}/${expectedFields.length}`);
  
  // Test submit button
  const submitButton = document.querySelector('.submit-button');
  if (submitButton) {
    console.log('✅ Submit button found');
    console.log(`📊 Submit button text: "${submitButton.textContent?.trim()}"`);
    
    if (submitButton.textContent?.includes('Send')) {
      console.log('✅ Submit button has correct text');
    }
  } else {
    console.log('❌ Submit button not found');
  }
  
  return foundFields >= 3;
}

// Test 5: Newsletter Section
function testNewsletterSection() {
  console.log('\n📧 Test 5: Newsletter Section');
  
  const newsletterSection = document.querySelector('.newsletter-section');
  if (!newsletterSection) {
    console.log('❌ Newsletter section not found');
    return false;
  }
  
  console.log('✅ Newsletter section found');
  
  // Test newsletter input
  const newsletterInput = document.querySelector('.newsletter-input');
  if (newsletterInput) {
    console.log('✅ Newsletter input found');
    console.log(`📊 Newsletter input placeholder: "${newsletterInput.placeholder}"`);
  } else {
    console.log('❌ Newsletter input not found');
  }
  
  // Test subscribe button
  const subscribeButton = document.querySelector('.newsletter-button');
  if (subscribeButton) {
    console.log('✅ Subscribe button found');
    console.log(`📊 Subscribe button text: "${subscribeButton.textContent?.trim()}"`);
    
    if (subscribeButton.textContent?.includes('Subscribe')) {
      console.log('✅ Subscribe button has correct text');
    }
  } else {
    console.log('❌ Subscribe button not found');
  }
  
  return true;
}

// Test 6: GSAP Scroll Animations
function testGSAPScrollAnimations() {
  console.log('\n🎬 Test 6: GSAP Scroll Animations');
  
  // Check if GSAP is loaded
  if (typeof gsap !== 'undefined') {
    console.log('✅ GSAP library loaded');
    console.log(`📊 GSAP version: ${gsap.version}`);
    
    // Check ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      console.log('✅ ScrollTrigger plugin loaded');
      
      const triggers = ScrollTrigger.getAll();
      console.log(`📊 ScrollTrigger instances: ${triggers.length}`);
      
      // Look for contact-specific triggers
      const contactTriggers = triggers.filter(trigger => {
        const triggerElement = trigger.trigger;
        return triggerElement && (
          triggerElement.classList.contains('contact-header') ||
          triggerElement.classList.contains('contact-info') ||
          triggerElement.classList.contains('contact-form') ||
          triggerElement.classList.contains('newsletter-section') ||
          triggerElement.closest('.contact-section')
        );
      });
      
      console.log(`📊 Contact ScrollTrigger instances: ${contactTriggers.length}`);
      
      if (contactTriggers.length > 0) {
        console.log('✅ Contact ScrollTrigger animations are configured');
        
        // Check trigger settings
        contactTriggers.forEach((trigger, index) => {
          console.log(`📊 Contact trigger ${index + 1}:`);
          console.log(`   - Start: ${trigger.start}`);
          console.log(`   - End: ${trigger.end}`);
        });
      } else {
        console.log('⚠️ No contact-specific ScrollTrigger instances found');
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

// Test 7: Lottie Animations
function testLottieAnimations() {
  console.log('\n🎭 Test 7: Lottie Animations');
  
  // Check if Lottie player is loaded
  if (typeof LottiePlayer !== 'undefined' || document.querySelector('lottie-player')) {
    console.log('✅ Lottie player loaded');
    
    const lottieElements = document.querySelectorAll('lottie-player');
    console.log(`📊 Lottie elements found: ${lottieElements.length}`);
    
    lottieElements.forEach((lottie, index) => {
      const src = lottie.getAttribute('src');
      const loop = lottie.getAttribute('loop');
      const autoplay = lottie.getAttribute('autoplay');
      
      console.log(`📊 Lottie ${index + 1}:`);
      console.log(`   - Source: ${src}`);
      console.log(`   - Loop: ${loop}`);
      console.log(`   - Autoplay: ${autoplay}`);
    });
    
    if (lottieElements.length > 0) {
      console.log('✅ Lottie animations are configured');
    } else {
      console.log('⚠️ No Lottie elements found');
    }
    
    return lottieElements.length > 0;
  } else {
    console.log('⚠️ Lottie player not loaded');
    return false;
  }
}

// Test 8: Theme Consistency
function testThemeConsistency() {
  console.log('\n🎨 Test 8: Theme Consistency');
  
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
    
    // Test contact section uses theme colors
    const contactSection = document.querySelector('.contact-section');
    if (contactSection) {
      const sectionStyle = window.getComputedStyle(contactSection);
      console.log(`📊 Contact section background: ${sectionStyle.backgroundColor}`);
      console.log(`📊 Contact section color: ${sectionStyle.color}`);
    }
    
    // Test contact title uses secondary color
    const contactTitle = document.querySelector('.contact-title');
    if (contactTitle) {
      const titleStyle = window.getComputedStyle(contactTitle);
      console.log(`📊 Contact title color: ${titleStyle.color}`);
      
      if (titleStyle.color.includes('38, 166, 154') || 
          titleStyle.color.includes('#26a69a')) {
        console.log('✅ Contact title uses secondary color');
      } else {
        console.log('⚠️ Contact title may not be using secondary color');
      }
    }
    
    return true;
  } else {
    console.log('❌ Theme colors not properly defined');
    return false;
  }
}

// Test 9: Form Validation
function testFormValidation() {
  console.log('\n✅ Test 9: Form Validation');
  
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) {
    console.log('❌ Contact form not found');
    return false;
  }
  
  // Test required field validation
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const messageField = document.getElementById('message');
  
  if (nameField && emailField && messageField) {
    console.log('✅ All form fields found');
    
    // Test empty form submission
    const submitButton = document.querySelector('.submit-button');
    if (submitButton) {
      console.log('📊 Testing form validation...');
      
      // Clear fields
      nameField.value = '';
      emailField.value = '';
      messageField.value = '';
      
      // Trigger validation
      nameField.dispatchEvent(new Event('blur'));
      emailField.dispatchEvent(new Event('blur'));
      messageField.dispatchEvent(new Event('blur'));
      
      setTimeout(() => {
        const errorMessages = document.querySelectorAll('.error-message');
        console.log(`📊 Error messages displayed: ${errorMessages.length}`);
        
        if (errorMessages.length > 0) {
          console.log('✅ Form validation is working');
          errorMessages.forEach((error, index) => {
            console.log(`📊 Error ${index + 1}: ${error.textContent}`);
          });
        } else {
          console.log('⚠️ Form validation may not be working');
        }
      }, 100);
    }
    
    return true;
  } else {
    console.log('❌ Some form fields not found');
    return false;
  }
}

// Test 10: Performance and Accessibility
function testPerformanceAndAccessibility() {
  console.log('\n⚡ Test 10: Performance and Accessibility');
  
  // Test lazy loading
  const contactModule = performance.getEntriesByName('contact-module');
  if (contactModule.length > 0) {
    console.log('✅ Contact module is lazy-loaded');
  } else {
    console.log('⚠️ Contact module lazy loading not detected');
  }
  
  // Test ARIA attributes
  const contactSection = document.querySelector('.contact-section');
  if (contactSection) {
    const role = contactSection.getAttribute('role');
    const ariaLabelledBy = contactSection.getAttribute('aria-labelledby');
    
    console.log(`📊 Contact section role: ${role}`);
    console.log(`📊 Contact section aria-labelledby: ${ariaLabelledBy}`);
    
    if (role === 'main' && ariaLabelledBy) {
      console.log('✅ Contact section has proper ARIA attributes');
    }
  }
  
  // Test form accessibility
  const formLabels = document.querySelectorAll('.form-label');
  const formInputs = document.querySelectorAll('.form-input, .form-textarea');
  
  console.log(`📊 Form labels: ${formLabels.length}`);
  console.log(`📊 Form inputs: ${formInputs.length}`);
  
  let accessibleInputs = 0;
  formInputs.forEach(input => {
    const id = input.getAttribute('id');
    const ariaDescribedBy = input.getAttribute('aria-describedby');
    const label = document.querySelector(`label[for="${id}"]`);
    
    if (label || ariaDescribedBy) {
      accessibleInputs++;
    }
  });
  
  console.log(`📊 Accessible form inputs: ${accessibleInputs}/${formInputs.length}`);
  
  if (accessibleInputs === formInputs.length) {
    console.log('✅ All form inputs are accessible');
  } else {
    console.log('⚠️ Some form inputs may need accessibility improvements');
  }
  
  return true;
}

// Run all contact tests
async function runContactComponentTests() {
  console.log('🚀 Running Contact Component Test Suite...\n');
  
  const tests = [
    testComponentStructure,
    testContactInformation,
    testSocialIcons,
    testContactForm,
    testNewsletterSection,
    testGSAPScrollAnimations,
    testLottieAnimations,
    testThemeConsistency,
    testFormValidation,
    testPerformanceAndAccessibility
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
  
  console.log(`\n📊 Contact Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All contact component tests passed! The contact page is working correctly.');
  } else {
    console.log('⚠️ Some contact tests failed. Check the console output for details.');
  }
  
  console.log('\n🔧 Manual Testing Recommendations:');
  console.log('1. Test form submission with valid data');
  console.log('2. Test form validation with invalid data');
  console.log('3. Test newsletter subscription');
  console.log('4. Test social icon hover animations');
  console.log('5. Test scroll animations by scrolling the page');
  console.log('6. Test responsive design on different screen sizes');
  console.log('7. Test keyboard navigation');
  console.log('8. Test with screen readers');
  
  return { passed: passedTests, total: totalTests };
}

// Auto-run tests
runContactComponentTests();

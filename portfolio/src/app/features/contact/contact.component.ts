import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  PLATFORM_ID,
  Inject,
  ElementRef,
  ViewChildren,
  ViewChild,
  QueryList
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('contactItem') contactItems!: QueryList<ElementRef>;
  @ViewChildren('formField') formFields!: QueryList<ElementRef>;
  @ViewChildren('socialIcon') socialIcons!: QueryList<ElementRef>;
  @ViewChild('contactHeader') contactHeader!: ElementRef;
  @ViewChild('contactInfo') contactInfo!: ElementRef;
  @ViewChild('contactForm') contactForm!: ElementRef;
  @ViewChild('newsletterSection') newsletterSection!: ElementRef;
  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('submitLottie') submitLottie!: any;
  @ViewChild('checkmarkLottie') checkmarkLottie!: any;

  contactFormGroup!: FormGroup;
  newsletterFormGroup!: FormGroup;
  isSubmitting = false;
  isNewsletterSubmitting = false;

  private destroy$ = new Subject<void>();
  private scrollTriggers: ScrollTrigger[] = [];
  private backgroundAnimationTween: gsap.core.Tween | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {
    // Register GSAP plugins
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  ngOnInit(): void {
    this.initializeForms();
    this.initializeBackgroundAnimation();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initializeScrollAnimations();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Clean up GSAP animations
    this.scrollTriggers.forEach(trigger => trigger.kill());
    if (this.backgroundAnimationTween) {
      this.backgroundAnimationTween.kill();
    }
    ScrollTrigger.refresh();
  }

  /**
   * Initialize reactive forms
   */
  private initializeForms(): void {
    this.contactFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.newsletterFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Initialize background gradient animation
   */
  private initializeBackgroundAnimation(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const contactSection = document.querySelector('.contact-section');
    if (contactSection) {
      // Create a subtle gradient animation
      this.backgroundAnimationTween = gsap.to(contactSection, {
        background: 'linear-gradient(135deg, var(--primary-color) 0%, #2C3E50 100%)',
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }
  }

  /**
   * Initialize GSAP scroll animations
   */
  private initializeScrollAnimations(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Animate contact header
    if (this.contactHeader?.nativeElement) {
      const headerTrigger = ScrollTrigger.create({
        trigger: this.contactHeader.nativeElement,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(this.contactHeader.nativeElement,
            {
              opacity: 0,
              y: 50,
              scale: 0.9
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: 'power3.out'
            }
          );
        },
        once: true
      });
      this.scrollTriggers.push(headerTrigger);
    }

    // Animate contact info items with stagger
    if (this.contactItems.length > 0) {
      const contactInfoTrigger = ScrollTrigger.create({
        trigger: this.contactInfo?.nativeElement,
        start: 'top 80%',
        onEnter: () => {
          const items = this.contactItems.map(item => item.nativeElement);
          gsap.fromTo(items,
            {
              opacity: 0,
              x: -50,
              scale: 0.8
            },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.2, // 0.2s stagger as requested
              ease: 'power2.out'
            }
          );
        },
        once: true
      });
      this.scrollTriggers.push(contactInfoTrigger);
    }

    // Animate form fields with stagger
    if (this.formFields.length > 0) {
      const formTrigger = ScrollTrigger.create({
        trigger: this.contactForm?.nativeElement,
        start: 'top 80%',
        onEnter: () => {
          const fields = this.formFields.map(field => field.nativeElement);
          gsap.fromTo(fields,
            {
              opacity: 0,
              y: 30,
              scale: 0.95
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              stagger: 0.2, // 0.2s stagger as requested
              ease: 'power2.out'
            }
          );
        },
        once: true
      });
      this.scrollTriggers.push(formTrigger);
    }

    // Animate newsletter section
    if (this.newsletterSection?.nativeElement) {
      const newsletterTrigger = ScrollTrigger.create({
        trigger: this.newsletterSection.nativeElement,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(this.newsletterSection.nativeElement,
            {
              opacity: 0,
              y: 40,
              scale: 0.9
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: 'power3.out'
            }
          );
        },
        once: true
      });
      this.scrollTriggers.push(newsletterTrigger);
    }
  }

  /**
   * Handle social icon hover with Lottie bounce animation
   */
  onSocialIconHover(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const icon = event.currentTarget as HTMLElement;

    // GSAP bounce animation
    gsap.to(icon, {
      scale: 1.2,
      y: -5,
      duration: 0.3,
      ease: 'back.out(1.7)'
    });
  }

  /**
   * Handle social icon leave
   */
  onSocialIconLeave(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const icon = event.currentTarget as HTMLElement;

    gsap.to(icon, {
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  /**
   * Check if form field is invalid
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactFormGroup.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Handle submit button click for Lottie animation
   */
  onSubmitButtonClick(): void {
    if (this.contactFormGroup.valid && !this.isSubmitting) {
      this.playSubmitAnimation();
    }
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.contactFormGroup.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.cdr.markForCheck();

      // Simulate API call
      setTimeout(() => {
        this.handleSubmissionSuccess();
      }, 1000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactFormGroup.controls).forEach(key => {
        this.contactFormGroup.get(key)?.markAsTouched();
      });
      this.cdr.markForCheck();
    }
  }

  /**
   * Handle newsletter submission
   */
  onNewsletterSubmit(): void {
    if (this.newsletterFormGroup.valid && !this.isNewsletterSubmitting) {
      this.isNewsletterSubmitting = true;
      this.cdr.markForCheck();

      // Simulate API call
      setTimeout(() => {
        this.snackBar.open('Successfully subscribed to newsletter!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        this.newsletterFormGroup.reset();
        this.isNewsletterSubmitting = false;
        this.cdr.markForCheck();
      }, 1000);
    } else {
      this.newsletterFormGroup.get('email')?.markAsTouched();
      this.cdr.markForCheck();
    }
  }

  /**
   * Play submit button animation
   */
  private playSubmitAnimation(): void {
    if (this.submitLottie?.nativeElement) {
      this.submitLottie.nativeElement.play();
    }
  }

  /**
   * Handle successful form submission
   */
  private handleSubmissionSuccess(): void {
    this.isSubmitting = false;

    // Show success message
    this.snackBar.open('Message sent successfully! I\'ll get back to you soon.', 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });

    // Play checkmark animation
    if (this.checkmarkLottie?.nativeElement) {
      this.checkmarkLottie.nativeElement.style.display = 'inline-block';
      this.checkmarkLottie.nativeElement.play();

      // Hide checkmark after animation
      setTimeout(() => {
        if (this.checkmarkLottie?.nativeElement) {
          this.checkmarkLottie.nativeElement.style.display = 'none';
        }
      }, 2000);
    }

    // Reset form
    this.contactFormGroup.reset();

    // Reset form validation state
    Object.keys(this.contactFormGroup.controls).forEach(key => {
      this.contactFormGroup.get(key)?.setErrors(null);
    });

    this.cdr.markForCheck();
  }

  /**
   * Get form control for template access
   */
  getFormControl(controlName: string) {
    return this.contactFormGroup.get(controlName);
  }

  /**
   * Get newsletter form control for template access
   */
  getNewsletterFormControl(controlName: string) {
    return this.newsletterFormGroup.get(controlName);
  }
}

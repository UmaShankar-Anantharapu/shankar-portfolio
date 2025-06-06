import { 
  Component, 
  OnInit, 
  AfterViewInit, 
  OnDestroy, 
  ViewChild, 
  ElementRef, 
  ChangeDetectionStrategy,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import * as THREE from 'three';
import { gsap } from 'gsap';

@Component({
  selector: 'app-threejs-demo-modal',
  template: `
    <div class="threejs-demo-modal">
      <div class="modal-header">
        <div class="header-content">
          <span class="skill-icon">🎮</span>
          <div class="header-text">
            <h2 class="skill-title">Three.js Demo</h2>
            <p class="skill-subtitle">Interactive 3D Rotating Sphere</p>
          </div>
        </div>
        <button 
          type="button" 
          class="close-btn"
          (click)="closeModal()"
          aria-label="Close modal">
          ✕
        </button>
      </div>
      
      <div class="modal-content">
        <!-- Three.js Scene Container -->
        <div class="scene-container">
          <div #threeContainer class="three-container"></div>
          
          <!-- Controls Overlay -->
          <div class="controls-overlay">
            <button 
              type="button" 
              class="control-btn"
              (click)="toggleAnimation()"
              [attr.title]="isAnimating ? 'Pause Animation' : 'Play Animation'">
              {{ isAnimating ? '⏸️' : '▶️' }}
            </button>
            <button 
              type="button" 
              class="control-btn"
              (click)="toggleWireframe()"
              title="Toggle Wireframe">
              🔲
            </button>
            <button 
              type="button" 
              class="control-btn"
              (click)="changeColor()"
              title="Change Color">
              🎨
            </button>
            <button 
              type="button" 
              class="control-btn"
              (click)="resetView()"
              title="Reset View">
              🔄
            </button>
          </div>
        </div>

        <!-- Info Panel -->
        <div class="info-panel">
          <h3 class="info-title">Three.js Features Demonstrated</h3>
          <div class="features-grid">
            <div class="feature-item">
              <span class="feature-icon">🌐</span>
              <div class="feature-content">
                <h4>WebGL Rendering</h4>
                <p>Hardware-accelerated 3D graphics</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🎭</span>
              <div class="feature-content">
                <h4>Material System</h4>
                <p>PBR materials with lighting</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🔄</span>
              <div class="feature-content">
                <h4>Animation Loop</h4>
                <p>Smooth 60fps animations</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🎮</span>
              <div class="feature-content">
                <h4>Interactive Controls</h4>
                <p>Real-time user interaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-actions">
        <button type="button" class="action-btn secondary" (click)="randomizeScene()">
          🎲 Randomize
        </button>
        <button type="button" class="action-btn primary" (click)="closeModal()">
          Close Demo
        </button>
      </div>
    </div>
  `,
  styles: [`
    .threejs-demo-modal {
      background: var(--primary-color);
      color: var(--text-color);
      border-radius: 16px;
      overflow: hidden;
      width: 100%;
      max-width: 800px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid rgba(38, 166, 154, 0.2);
      background: rgba(255, 255, 255, 0.02);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .skill-icon {
      font-size: 2rem;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }

    .skill-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--secondary-color);
      margin: 0;
    }

    .skill-subtitle {
      font-family: 'Inter', sans-serif;
      color: var(--text-color-secondary);
      margin: 0;
      font-size: 0.9rem;
    }

    .close-btn {
      background: none;
      border: none;
      color: var(--text-color-secondary);
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--secondary-color);
    }

    .modal-content {
      padding: 2rem;
    }

    .scene-container {
      position: relative;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 2rem;
      border: 1px solid rgba(38, 166, 154, 0.2);
    }

    .three-container {
      width: 100%;
      height: 400px;
      position: relative;
    }

    .controls-overlay {
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: flex;
      gap: 0.5rem;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 8px;
      padding: 0.5rem;
      backdrop-filter: blur(10px);
    }

    .control-btn {
      background: rgba(38, 166, 154, 0.2);
      border: 1px solid rgba(38, 166, 154, 0.3);
      color: white;
      border-radius: 6px;
      padding: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .control-btn:hover {
      background: rgba(38, 166, 154, 0.4);
      transform: scale(1.1);
    }

    .info-panel {
      background: rgba(255, 255, 255, 0.02);
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid rgba(38, 166, 154, 0.1);
    }

    .info-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.2rem;
      color: var(--secondary-color);
      margin: 0 0 1rem 0;
      text-align: center;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
      border: 1px solid rgba(38, 166, 154, 0.1);
      transition: all 0.3s ease;
    }

    .feature-item:hover {
      transform: translateY(-2px);
      border-color: rgba(38, 166, 154, 0.3);
    }

    .feature-icon {
      font-size: 1.5rem;
      opacity: 0.8;
    }

    .feature-content h4 {
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      color: var(--text-color);
      margin: 0 0 0.25rem 0;
      font-weight: 600;
    }

    .feature-content p {
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      color: var(--text-color-secondary);
      margin: 0;
    }

    .modal-actions {
      padding: 1rem 1.5rem;
      border-top: 1px solid rgba(38, 166, 154, 0.2);
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .action-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-btn.primary {
      background: var(--secondary-color);
      color: white;
    }

    .action-btn.secondary {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-color);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .action-btn:hover {
      transform: translateY(-2px);
    }

    .action-btn.primary:hover {
      background: #1e8a7a;
    }

    .action-btn.secondary:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    @media (max-width: 768px) {
      .three-container {
        height: 300px;
      }
      
      .modal-content {
        padding: 1.5rem;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThreeJSDemoModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('threeContainer', { static: false }) threeContainer!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private sphere!: THREE.Mesh;
  private animationId: number | null = null;
  
  isAnimating = true;
  private colors = [0x26a69a, 0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0xf0932b];
  private currentColorIndex = 0;

  constructor(
    private readonly dialogRef: MatDialogRef<ThreeJSDemoModalComponent>,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initThreeJS();
        this.animate();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private initThreeJS(): void {
    if (!this.threeContainer?.nativeElement) return;

    const container = this.threeContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a);

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // Sphere geometry
    const geometry = new THREE.SphereGeometry(1.5, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: this.colors[this.currentColorIndex],
      shininess: 100,
      transparent: true,
      opacity: 0.9
    });

    this.sphere = new THREE.Mesh(geometry, material);
    this.scene.add(this.sphere);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);

    // Add particles
    this.addParticles();

    // Handle resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private addParticles(): void {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: 0x26a69a,
      transparent: true,
      opacity: 0.8
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(particlesMesh);
  }

  private animate(): void {
    if (this.isAnimating && this.sphere) {
      this.sphere.rotation.x += 0.01;
      this.sphere.rotation.y += 0.01;
      
      // Add floating motion
      this.sphere.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private onWindowResize(): void {
    if (!this.threeContainer?.nativeElement) return;

    const container = this.threeContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  toggleAnimation(): void {
    this.isAnimating = !this.isAnimating;
  }

  toggleWireframe(): void {
    if (this.sphere && this.sphere.material instanceof THREE.MeshPhongMaterial) {
      this.sphere.material.wireframe = !this.sphere.material.wireframe;
    }
  }

  changeColor(): void {
    this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
    
    if (this.sphere && this.sphere.material instanceof THREE.MeshPhongMaterial) {
      gsap.to(this.sphere.material.color, {
        r: ((this.colors[this.currentColorIndex] >> 16) & 255) / 255,
        g: ((this.colors[this.currentColorIndex] >> 8) & 255) / 255,
        b: (this.colors[this.currentColorIndex] & 255) / 255,
        duration: 1,
        ease: 'power2.out'
      });
    }
  }

  resetView(): void {
    if (this.sphere) {
      gsap.to(this.sphere.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        ease: 'power2.out'
      });
      
      gsap.to(this.sphere.position, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        ease: 'power2.out'
      });
    }
  }

  randomizeScene(): void {
    if (this.sphere) {
      // Random rotation speed
      const randomRotationX = (Math.random() - 0.5) * 0.1;
      const randomRotationY = (Math.random() - 0.5) * 0.1;
      
      gsap.to(this.sphere.rotation, {
        x: this.sphere.rotation.x + randomRotationX * 10,
        y: this.sphere.rotation.y + randomRotationY * 10,
        duration: 2,
        ease: 'power2.out'
      });
      
      // Random color
      this.changeColor();
      
      // Random scale
      const randomScale = 0.8 + Math.random() * 0.4;
      gsap.to(this.sphere.scale, {
        x: randomScale,
        y: randomScale,
        z: randomScale,
        duration: 1,
        ease: 'elastic.out(1, 0.3)'
      });
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}

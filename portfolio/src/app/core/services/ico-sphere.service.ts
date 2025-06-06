import { Injectable, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { gsap } from 'gsap';

export interface IcoSphereConfig {
  size: 'small' | 'large';
  animated: boolean;
  interactive: boolean;
  pointCount: number;
  primaryColor: string;
  secondaryColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class IcoSphereService {
  private scenes: Map<string, THREE.Scene> = new Map();
  private cameras: Map<string, THREE.PerspectiveCamera> = new Map();
  private renderers: Map<string, THREE.WebGLRenderer> = new Map();
  private spheres: Map<string, THREE.Group> = new Map();
  private animationIds: Map<string, number> = new Map();
  private isVisible: Map<string, boolean> = new Map();
  
  // Performance optimization
  private lastTime = 0;
  private targetFPS = 60;
  private frameInterval = 1000 / this.targetFPS;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {}

  /**
   * Initialize ICO Sphere preview
   * @param container - Container element
   * @param config - Sphere configuration
   * @param instanceId - Unique instance identifier
   */
  initSphere(container: ElementRef, config: IcoSphereConfig, instanceId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      this.setupScene(container, config, instanceId);
      this.createIcoSphere(config, instanceId);
      if (config.interactive) {
        this.setupInteraction(container, instanceId);
      }
      if (config.animated) {
        this.animate(instanceId);
      }
    } catch (error) {
      console.error('Error initializing ICO Sphere:', error);
      this.createFallbackSphere(container, config);
    }
  }

  /**
   * Create fallback sphere for unsupported browsers
   */
  private createFallbackSphere(container: ElementRef, config: IcoSphereConfig): void {
    const fallbackDiv = document.createElement('div');
    fallbackDiv.className = 'ico-sphere-fallback';
    fallbackDiv.style.cssText = `
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, ${config.secondaryColor}40, ${config.primaryColor}20);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${config.secondaryColor};
      font-family: 'Orbitron', sans-serif;
      font-size: ${config.size === 'large' ? '1.2rem' : '0.8rem'};
      font-weight: 600;
      transition: transform 0.3s ease;
      cursor: pointer;
    `;
    fallbackDiv.textContent = '3D Sphere';

    if (config.animated) {
      fallbackDiv.style.animation = 'spherePulse 2s ease-in-out infinite';
    }

    container.nativeElement.appendChild(fallbackDiv);
  }

  /**
   * Setup Three.js scene
   */
  private setupScene(container: ElementRef, config: IcoSphereConfig, instanceId: string): void {
    // Scene
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background
    this.scenes.set(instanceId, scene);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      container.nativeElement.clientWidth / container.nativeElement.clientHeight,
      0.1,
      1000
    );
    camera.position.z = config.size === 'large' ? 8 : 5;
    this.cameras.set(instanceId, camera);

    // Renderer with performance optimizations
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: config.size === 'large', // Only enable antialiasing for large spheres
      powerPreference: 'high-performance'
    });
    
    renderer.setSize(
      container.nativeElement.clientWidth,
      container.nativeElement.clientHeight
    );
    renderer.setClearColor(0x000000, 0); // Transparent
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    
    this.renderers.set(instanceId, renderer);
    container.nativeElement.appendChild(renderer.domElement);

    // Lighting optimized for performance
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    this.isVisible.set(instanceId, true);
  }

  /**
   * Create ICO Sphere with points
   */
  private createIcoSphere(config: IcoSphereConfig, instanceId: string): void {
    const scene = this.scenes.get(instanceId);
    if (!scene) return;

    const sphereGroup = new THREE.Group();

    // Main sphere geometry - optimized for performance
    const radius = config.size === 'large' ? 3 : 2;
    const detail = config.size === 'large' ? 2 : 1; // Reduce detail for small spheres
    
    const geometry = new THREE.IcosahedronGeometry(radius, detail);
    
    // Sphere material with theme colors
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: config.primaryColor,
      transparent: true,
      opacity: 0.7,
      wireframe: false,
      shininess: 100
    });

    const sphere = new THREE.Mesh(geometry, sphereMaterial);
    sphereGroup.add(sphere);

    // Wireframe overlay
    const wireframeGeometry = new THREE.IcosahedronGeometry(radius + 0.01, detail);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: config.secondaryColor,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    sphereGroup.add(wireframe);

    // Add points around the sphere
    this.createSpherePoints(sphereGroup, config, radius);

    // Add particle system for enhanced visual effect
    if (config.size === 'large') {
      this.createParticleSystem(sphereGroup, config, radius);
    }

    this.spheres.set(instanceId, sphereGroup);
    scene.add(sphereGroup);
  }

  /**
   * Create points around the sphere
   */
  private createSpherePoints(sphereGroup: THREE.Group, config: IcoSphereConfig, radius: number): void {
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsCount = Math.min(config.pointCount, config.size === 'large' ? 200 : 100); // Limit points for performance
    const positions = new Float32Array(pointsCount * 3);
    const colors = new Float32Array(pointsCount * 3);

    // Generate points on sphere surface
    for (let i = 0; i < pointsCount; i++) {
      const i3 = i * 3;
      
      // Spherical coordinates
      const phi = Math.acos(-1 + (2 * i) / pointsCount);
      const theta = Math.sqrt(pointsCount * Math.PI) * phi;
      
      const x = radius * 1.2 * Math.cos(theta) * Math.sin(phi);
      const y = radius * 1.2 * Math.cos(phi);
      const z = radius * 1.2 * Math.sin(theta) * Math.sin(phi);
      
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      // Alternate colors between primary and secondary
      const color = new THREE.Color(i % 2 === 0 ? config.secondaryColor : config.primaryColor);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      size: config.size === 'large' ? 0.1 : 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    sphereGroup.add(points);
  }

  /**
   * Create particle system for large spheres
   */
  private createParticleSystem(sphereGroup: THREE.Group, config: IcoSphereConfig, radius: number): void {
    const particleCount = 50;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * radius * 3;
      positions[i3 + 1] = (Math.random() - 0.5) * radius * 3;
      positions[i3 + 2] = (Math.random() - 0.5) * radius * 3;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: config.secondaryColor,
      size: 0.02,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    sphereGroup.add(particles);
  }

  /**
   * Setup mouse interaction
   */
  private setupInteraction(container: ElementRef, instanceId: string): void {
    const sphere = this.spheres.get(instanceId);
    if (!sphere) return;

    container.nativeElement.addEventListener('mouseenter', () => {
      gsap.to(sphere.rotation, {
        duration: 0.5,
        x: sphere.rotation.x + 0.2,
        y: sphere.rotation.y + 0.2,
        ease: 'power2.out'
      });
      
      gsap.to(sphere.scale, {
        duration: 0.3,
        x: 1.1,
        y: 1.1,
        z: 1.1,
        ease: 'power2.out'
      });
    });

    container.nativeElement.addEventListener('mouseleave', () => {
      gsap.to(sphere.scale, {
        duration: 0.3,
        x: 1,
        y: 1,
        z: 1,
        ease: 'power2.out'
      });
    });
  }

  /**
   * Animation loop with performance optimization
   */
  private animate(instanceId: string): void {
    const currentTime = performance.now();
    
    // Frame rate limiting for performance
    if (currentTime - this.lastTime < this.frameInterval || !this.isVisible.get(instanceId)) {
      this.animationIds.set(instanceId, requestAnimationFrame(() => this.animate(instanceId)));
      return;
    }
    
    this.lastTime = currentTime;

    const scene = this.scenes.get(instanceId);
    const camera = this.cameras.get(instanceId);
    const renderer = this.renderers.get(instanceId);
    const sphere = this.spheres.get(instanceId);

    if (scene && camera && renderer && sphere) {
      // Smooth rotation
      sphere.rotation.x += 0.005;
      sphere.rotation.y += 0.01;

      // Subtle floating animation
      sphere.position.y = Math.sin(currentTime * 0.001) * 0.1;

      renderer.render(scene, camera);
    }

    this.animationIds.set(instanceId, requestAnimationFrame(() => this.animate(instanceId)));
  }

  /**
   * Pause animation for performance
   */
  pauseAnimation(instanceId: string): void {
    this.isVisible.set(instanceId, false);
  }

  /**
   * Resume animation
   */
  resumeAnimation(instanceId: string): void {
    this.isVisible.set(instanceId, true);
  }

  /**
   * Resize sphere scene
   */
  resizeSphere(instanceId: string, width: number, height: number): void {
    const camera = this.cameras.get(instanceId);
    const renderer = this.renderers.get(instanceId);

    if (camera && renderer) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
  }

  /**
   * Cleanup sphere instance
   */
  destroySphere(instanceId: string): void {
    // Cancel animation
    const animationId = this.animationIds.get(instanceId);
    if (animationId) {
      cancelAnimationFrame(animationId);
      this.animationIds.delete(instanceId);
    }

    // Dispose of Three.js objects
    const scene = this.scenes.get(instanceId);
    const renderer = this.renderers.get(instanceId);
    const sphere = this.spheres.get(instanceId);

    if (sphere) {
      sphere.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }

    if (renderer) {
      renderer.dispose();
      renderer.domElement.remove();
    }

    // Clear maps
    this.scenes.delete(instanceId);
    this.cameras.delete(instanceId);
    this.renderers.delete(instanceId);
    this.spheres.delete(instanceId);
    this.isVisible.delete(instanceId);
  }

  /**
   * Update theme colors
   */
  updateTheme(instanceId: string, primaryColor: string, secondaryColor: string): void {
    const sphere = this.spheres.get(instanceId);
    if (!sphere) return;

    sphere.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material instanceof THREE.MeshPhongMaterial) {
          child.material.color.setStyle(primaryColor);
        } else if (child.material instanceof THREE.MeshBasicMaterial) {
          child.material.color.setStyle(secondaryColor);
        }
      } else if (child instanceof THREE.Points) {
        if (child.material instanceof THREE.PointsMaterial) {
          child.material.color.setStyle(secondaryColor);
        }
      }
    });
  }
}

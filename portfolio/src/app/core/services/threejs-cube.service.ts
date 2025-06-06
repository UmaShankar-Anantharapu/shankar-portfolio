import { Injectable, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface CubeFace {
  technology: string;
  color: string;
  tooltip: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThreejsCubeService {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cube!: THREE.Mesh;
  private wireframe!: THREE.LineSegments;
  private glowWireframe!: THREE.LineSegments;
  private raycaster!: THREE.Raycaster;
  private mouse!: THREE.Vector2;
  private container!: ElementRef;
  private animationId!: number;
  private isRotating = true;
  private isVisible = true;
  private isHovering = false;
  private lastTime = 0;
  private targetFPS = 60;
  private frameInterval = 1000 / this.targetFPS;

  // Manual rotation controls
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  private rotationVelocity = { x: 0, y: 0 };
  private autoRotationResumeTimeout?: number;
  private dragSensitivity = 0.005;
  private velocityDamping = 0.95;

  private faces: CubeFace[] = [
    {
      technology: 'Highcharts',
      color: '#7CB342',
      tooltip: 'Advanced data visualization and charting library featuring interactive charts, real-time data binding, extensive customization options, and responsive design. Perfect for creating dashboards, analytics interfaces, and business intelligence applications with support for multiple chart types including line, bar, pie, scatter, and complex financial charts.'
    },
    {
      technology: 'AG-Grid',
      color: '#FF6F00',
      tooltip: 'Enterprise-grade data grid component with advanced features including virtual scrolling, server-side data processing, column grouping, filtering, sorting, cell editing, and export capabilities. Optimized for handling large datasets with excellent performance and extensive customization options for complex data management interfaces.'
    },
    {
      technology: 'Three.js',
      color: '#000000',
      tooltip: 'Powerful 3D graphics library built on WebGL for creating immersive 3D experiences in web browsers. Enables development of interactive visualizations, games, architectural walkthroughs, and data representations with support for advanced lighting, materials, animations, and post-processing effects.'
    },
    {
      technology: 'Fabric.js/Konva.js',
      color: '#9C27B0',
      tooltip: 'Canvas manipulation libraries for creating interactive 2D graphics and drawing applications. Features include object manipulation, event handling, serialization, image filters, and animation capabilities. Ideal for building drawing tools, image editors, diagramming applications, and interactive graphics interfaces.'
    },
    {
      technology: 'Gridster',
      color: '#1976D2',
      tooltip: 'Dynamic dashboard layout management system enabling drag-and-drop widget functionality, responsive grid layouts, and user-customizable interfaces. Provides flexible positioning, resizing capabilities, and persistent layout configurations for creating interactive dashboards and personalized workspaces.'
    },
    {
      technology: 'MFE Architecture',
      color: '#FF5722',
      tooltip: 'Micro Frontend architecture pattern for building scalable, maintainable enterprise applications. Enables independent development, deployment, and scaling of frontend modules, team autonomy, technology diversity, and improved fault isolation while maintaining consistent user experiences across large-scale applications.'
    }
  ];

  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  initCube(container: ElementRef, onFaceClick: (technology: string) => void): void {
    try {
      this.container = container;
      this.setupScene();
      this.createCube();
      this.setupEventListeners(onFaceClick);
      this.setupScrollTrigger();
      this.animate();
    } catch (error) {
      console.error('Error initializing Three.js cube:', error);
      this.createFallbackCube(container, onFaceClick);
    }
  }

  private createFallbackCube(container: ElementRef, onFaceClick: (technology: string) => void): void {
    const fallbackDiv = document.createElement('div');
    fallbackDiv.style.cssText = `
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, #26A69A, #1A1A1A);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
      font-family: 'Orbitron', sans-serif;
      cursor: pointer;
      transition: transform 0.3s ease;
    `;

    fallbackDiv.innerHTML = `
      <div style="font-size: 1.2rem; margin-bottom: 1rem;">Technology Cube</div>
      <div style="font-size: 0.9rem; text-align: center;">Click to explore technologies</div>
    `;

    fallbackDiv.addEventListener('click', () => {
      onFaceClick('Angular'); // Default to Angular
    });

    fallbackDiv.addEventListener('mouseenter', () => {
      fallbackDiv.style.transform = 'scale(1.05)';
    });

    fallbackDiv.addEventListener('mouseleave', () => {
      fallbackDiv.style.transform = 'scale(1)';
    });

    container.nativeElement.appendChild(fallbackDiv);
  }

  private setupScene(): void {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = null; // Transparent background

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.nativeElement.clientWidth / this.container.nativeElement.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 8;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    this.renderer.setSize(
      this.container.nativeElement.clientWidth,
      this.container.nativeElement.clientHeight
    );
    this.renderer.setClearColor(0x000000, 0); // Transparent
    this.container.nativeElement.appendChild(this.renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
  }

  private createCube(): void {
    // Geometry - Optimized with fewer segments for better performance
    const geometry = new THREE.BoxGeometry(5, 5, 5, 2, 2, 2);

    // Create materials with face labels for each face
    const materials = this.faces.map((face, index) => {
      return this.createFaceMaterial(face.technology, index);
    });

    // Create cube with labeled materials
    this.cube = new THREE.Mesh(geometry, materials);

    // Create enhanced wireframe with theme colors
    const wireframeGeometry = new THREE.EdgesGeometry(geometry);

    // Get theme colors from CSS custom properties
    const secondaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--secondary-color').trim() || '#26A69A';

    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(secondaryColor),
      linewidth: 3,
      transparent: true,
      opacity: 0.8
    });

    this.wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    this.cube.add(this.wireframe);

    // Add subtle glow effect wireframe
    const glowWireframeMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(secondaryColor),
      linewidth: 6,
      transparent: true,
      opacity: 0.2
    });

    this.glowWireframe = new THREE.LineSegments(wireframeGeometry, glowWireframeMaterial);
    this.cube.add(this.glowWireframe);

    this.scene.add(this.cube);
  }

  private createFaceMaterial(technology: string, faceIndex: number): THREE.MeshBasicMaterial {
    // Create canvas for face label
    const canvas = document.createElement('canvas');
    const canvasSize = 512; // Higher resolution for better text quality
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const context = canvas.getContext('2d')!;

    // Get theme colors from CSS custom properties
    const secondaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--secondary-color').trim() || '#26A69A';

    // Clear canvas with transparent background
    context.clearRect(0, 0, canvasSize, canvasSize);

    // Add subtle background gradient for better text visibility
    const gradient = context.createRadialGradient(
      canvasSize / 2, canvasSize / 2, 0,
      canvasSize / 2, canvasSize / 2, canvasSize / 2
    );
    gradient.addColorStop(0, 'rgba(26, 26, 26, 0.3)');
    gradient.addColorStop(0.7, 'rgba(26, 26, 26, 0.1)');
    gradient.addColorStop(1, 'rgba(26, 26, 26, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvasSize, canvasSize);

    // Configure text styling
    context.fillStyle = secondaryColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Dynamic font sizing based on text length
    const baseFontSize = 48;
    const maxWidth = canvasSize * 0.85; // 85% of canvas width
    let fontSize = baseFontSize;

    // Adjust font size for longer technology names
    if (technology.length > 15) {
      fontSize = 32;
    } else if (technology.length > 10) {
      fontSize = 38;
    }

    // Set font with Orbitron for consistency
    context.font = `bold ${fontSize}px 'Orbitron', sans-serif`;

    // Handle multi-line text for longer names
    const words = technology.split(/[\s\/]/); // Split on spaces and forward slashes
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = context.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    // Draw text lines with enhanced styling
    const lineHeight = fontSize * 1.3;
    const totalHeight = lines.length * lineHeight;
    const startY = (canvasSize - totalHeight) / 2 + lineHeight / 2;

    lines.forEach((line, index) => {
      const y = startY + (index * lineHeight);

      // Draw text outline for better visibility
      context.strokeStyle = 'rgba(0, 0, 0, 0.8)';
      context.lineWidth = 4;
      context.strokeText(line, canvasSize / 2, y);

      // Add outer glow effect
      context.shadowColor = secondaryColor;
      context.shadowBlur = 16;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.fillText(line, canvasSize / 2, y);

      // Add inner glow
      context.shadowColor = 'rgba(255, 255, 255, 0.3)';
      context.shadowBlur = 8;
      context.fillText(line, canvasSize / 2, y);

      // Final clean text layer
      context.shadowColor = 'transparent';
      context.shadowBlur = 0;
      context.fillStyle = secondaryColor;
      context.fillText(line, canvasSize / 2, y);
    });

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // Create material with the text texture
    return new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.95, // Slightly more opaque for better text visibility
      side: THREE.DoubleSide,
      alphaTest: 0.1,
      depthWrite: false // Helps with transparency sorting
    });
  }

  private setupEventListeners(onFaceClick: (technology: string) => void): void {
    const canvas = this.renderer.domElement;

    // Mouse move for hover effects and drag rotation
    canvas.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Handle drag rotation
      if (this.isDragging) {
        const deltaX = event.clientX - this.previousMousePosition.x;
        const deltaY = event.clientY - this.previousMousePosition.y;

        // Apply rotation based on mouse movement
        this.rotationVelocity.y = deltaX * this.dragSensitivity;
        this.rotationVelocity.x = deltaY * this.dragSensitivity;

        // Apply rotation to cube
        this.cube.rotation.y += this.rotationVelocity.y;
        this.cube.rotation.x += this.rotationVelocity.x;

        this.previousMousePosition.x = event.clientX;
        this.previousMousePosition.y = event.clientY;

        // Clear auto-rotation resume timeout while dragging
        if (this.autoRotationResumeTimeout) {
          clearTimeout(this.autoRotationResumeTimeout);
          this.autoRotationResumeTimeout = undefined;
        }

        return; // Skip hover detection while dragging
      }

      // Regular hover detection (only when not dragging)
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObject(this.cube);

      if (intersects.length > 0) {
        // Cube is being hovered
        if (!this.isHovering) {
          this.isHovering = true;
          this.pauseRotation();
          this.enhanceWireframeGlow();
        }

        canvas.style.cursor = this.isDragging ? 'grabbing' : 'grab';
        this.showTooltip(intersects[0], event);
      } else {
        // Not hovering over cube
        if (this.isHovering && !this.isDragging) {
          this.isHovering = false;
          this.resumeRotation();
          this.resetWireframeGlow();
        }

        canvas.style.cursor = 'default';
        this.hideTooltip();
      }
    });

    // Mouse down - start drag
    canvas.addEventListener('mousedown', (event) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObject(this.cube);

      if (intersects.length > 0) {
        this.isDragging = true;
        this.pauseRotation();
        this.previousMousePosition.x = event.clientX;
        this.previousMousePosition.y = event.clientY;
        canvas.style.cursor = 'grabbing';

        // Hide tooltip while dragging
        this.hideTooltip();

        // Prevent text selection while dragging
        event.preventDefault();
      }
    });

    // Mouse up - end drag
    canvas.addEventListener('mouseup', (event) => {
      if (this.isDragging) {
        this.isDragging = false;
        canvas.style.cursor = 'grab';

        // Schedule auto-rotation resume after delay
        this.scheduleAutoRotationResume();
      }
    });

    // Click events (only trigger if not dragging)
    canvas.addEventListener('click', (event) => {
      // Prevent click if we were dragging
      if (Math.abs(this.rotationVelocity.x) > 0.001 || Math.abs(this.rotationVelocity.y) > 0.001) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObject(this.cube);

      if (intersects.length > 0) {
        // Use the same logic as showTooltip for consistency
        const triangleFaceIndex = intersects[0].faceIndex!;
        const materialIndex = Math.floor(triangleFaceIndex / 2);

        // The material index directly corresponds to our faces array
        const technology = this.faces[materialIndex]?.technology;
        if (technology) {
          onFaceClick(technology);
        }
      }
    });

    // Mouse leave canvas - ensure we reset states
    canvas.addEventListener('mouseleave', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.scheduleAutoRotationResume();
      }

      if (this.isHovering) {
        this.isHovering = false;
        if (!this.isDragging) {
          this.resumeRotation();
        }
        this.resetWireframeGlow();
      }

      this.hideTooltip();
      canvas.style.cursor = 'default';
    });

    // Global mouse up to handle drag end outside canvas
    document.addEventListener('mouseup', this.handleGlobalMouseUp);
  }

  private enhanceWireframeGlow(): void {
    if (this.glowWireframe && this.wireframe) {
      // Enhance glow effect on hover
      (this.glowWireframe.material as THREE.LineBasicMaterial).opacity = 0.4;
      (this.wireframe.material as THREE.LineBasicMaterial).opacity = 1.0;
    }
  }

  private resetWireframeGlow(): void {
    if (this.glowWireframe && this.wireframe) {
      // Reset to normal glow
      (this.glowWireframe.material as THREE.LineBasicMaterial).opacity = 0.2;
      (this.wireframe.material as THREE.LineBasicMaterial).opacity = 0.8;
    }
  }

  private scheduleAutoRotationResume(): void {
    // Clear any existing timeout
    if (this.autoRotationResumeTimeout) {
      clearTimeout(this.autoRotationResumeTimeout);
    }

    // Schedule auto-rotation resume after 2.5 seconds
    this.autoRotationResumeTimeout = setTimeout(() => {
      if (!this.isDragging && !this.isHovering) {
        this.resumeRotation();
      }
      this.autoRotationResumeTimeout = undefined;
    }, 2500);
  }

  private applyVelocityDamping(): void {
    // Apply damping to rotation velocity for smooth deceleration
    this.rotationVelocity.x *= this.velocityDamping;
    this.rotationVelocity.y *= this.velocityDamping;

    // Apply residual velocity to cube rotation
    if (Math.abs(this.rotationVelocity.x) > 0.001 || Math.abs(this.rotationVelocity.y) > 0.001) {
      this.cube.rotation.x += this.rotationVelocity.x;
      this.cube.rotation.y += this.rotationVelocity.y;
    } else {
      // Stop applying velocity when it's negligible
      this.rotationVelocity.x = 0;
      this.rotationVelocity.y = 0;
    }
  }

  private showTooltip(intersect: THREE.Intersection, event: MouseEvent): void {
    // Three.js BoxGeometry face order: [+X, -X, +Y, -Y, +Z, -Z]
    // Each face has 2 triangles, so we get the material index directly
    const triangleFaceIndex = intersect.faceIndex!;
    const materialIndex = Math.floor(triangleFaceIndex / 2);

    // The material index directly corresponds to our faces array
    // since we create materials in the same order as the faces array
    const face = this.faces[materialIndex];

    if (face) {
      let tooltip = document.getElementById('cube-tooltip');
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'cube-tooltip';

        // Get theme colors for consistent styling
        const primaryColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--primary-color').trim() || '#1A1A1A';
        const secondaryColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--secondary-color').trim() || '#26A69A';

        tooltip.style.cssText = `
          position: fixed;
          background: linear-gradient(135deg, ${primaryColor} 0%, rgba(26, 26, 26, 0.95) 100%);
          color: var(--text-color, #ffffff);
          padding: 20px 24px;
          border-radius: 16px;
          font-family: 'Inter', sans-serif;
          pointer-events: none;
          z-index: 10000;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          border: 2px solid ${secondaryColor};
          box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.4),
            0 0 20px rgba(38, 166, 154, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          max-width: 380px;
          line-height: 1.5;
          backdrop-filter: blur(20px);
          transform: translateY(-10px) scale(0.95);
          opacity: 0;
        `;
        document.body.appendChild(tooltip);
      }

      // Create enhanced tooltip content with title and description
      const title = face.technology;
      const description = face.tooltip;

      // Get secondary color for styling
      const currentSecondaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--secondary-color').trim() || '#26A69A';

      tooltip.innerHTML = `
        <div style="
          font-family: 'Orbitron', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: ${currentSecondaryColor};
          margin-bottom: 16px;
          text-shadow:
            0 0 16px rgba(38, 166, 154, 0.8),
            0 0 32px rgba(38, 166, 154, 0.4),
            0 2px 4px rgba(0, 0, 0, 0.8);
          letter-spacing: 1px;
          text-transform: uppercase;
          background: linear-gradient(135deg, ${currentSecondaryColor} 0%, rgba(38, 166, 154, 0.7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
        ">${title}</div>
        <div style="
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          color: var(--text-color, #ffffff);
          line-height: 1.7;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
          opacity: 0.95;
        ">${description}</div>
      `;

      // Smart positioning to avoid going off-screen
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let left = event.clientX + 20;
      let top = event.clientY - 80;

      // Adjust if tooltip would go off right edge
      if (left + tooltipRect.width > viewportWidth - 20) {
        left = event.clientX - tooltipRect.width - 20;
      }

      // Adjust if tooltip would go off top edge
      if (top < 20) {
        top = event.clientY + 20;
      }

      // Adjust if tooltip would go off bottom edge
      if (top + tooltipRect.height > viewportHeight - 20) {
        top = viewportHeight - tooltipRect.height - 20;
      }

      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translateY(0) scale(1)';
    }
  }

  private hideTooltip(): void {
    const tooltip = document.getElementById('cube-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '0';
      tooltip.style.transform = 'translateY(-10px) scale(0.95)';
    }
  }

  private setupScrollTrigger(): void {
    ScrollTrigger.create({
      trigger: this.container.nativeElement,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => {
        this.isVisible = true;
        this.resumeRotation();
      },
      onLeave: () => {
        this.isVisible = false;
        this.pauseRotation();
      },
      onEnterBack: () => {
        this.isVisible = true;
        this.resumeRotation();
      },
      onLeaveBack: () => {
        this.isVisible = false;
        this.pauseRotation();
      }
    });
  }

  private animate(): void {
    this.animationId = requestAnimationFrame((currentTime) => this.animateFrame(currentTime));
  }

  private animateFrame(currentTime: number): void {
    // Performance optimization: Limit frame rate and only render when visible
    if (currentTime - this.lastTime < this.frameInterval || !this.isVisible) {
      this.animate();
      return;
    }
    this.lastTime = currentTime;

    // Apply velocity damping for smooth manual rotation deceleration
    if (!this.isDragging) {
      this.applyVelocityDamping();
    }

    // Auto rotation (only when not dragging and rotation is enabled)
    if (this.isRotating && this.isVisible && !this.isDragging) {
      // Reduced rotation speed for better performance
      this.cube.rotation.x += 0.003;
      this.cube.rotation.y += 0.006;
    }

    this.renderer.render(this.scene, this.camera);
    this.animate();
  }

  pauseRotation(): void {
    this.isRotating = false;
  }

  resumeRotation(): void {
    this.isRotating = true;
  }

  onWindowResize(): void {
    if (this.container && this.camera && this.renderer) {
      const width = this.container.nativeElement.clientWidth;
      const height = this.container.nativeElement.clientHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }

  updateThemeColors(): void {
    // Update wireframe colors
    if (this.wireframe && this.glowWireframe) {
      const secondaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--secondary-color').trim() || '#26A69A';

      (this.wireframe.material as THREE.LineBasicMaterial).color.setStyle(secondaryColor);
      (this.glowWireframe.material as THREE.LineBasicMaterial).color.setStyle(secondaryColor);
    }

    // Update face label colors
    if (this.cube && Array.isArray(this.cube.material)) {
      this.cube.material.forEach((material, index) => {
        const basicMaterial = material as THREE.MeshBasicMaterial;
        if (basicMaterial.map) {
          // Recreate the face material with updated theme colors
          const newMaterial = this.createFaceMaterial(this.faces[index].technology, index);

          // Dispose of old texture
          basicMaterial.map.dispose();
          basicMaterial.dispose();

          // Replace with new material
          (this.cube.material as THREE.MeshBasicMaterial[])[index] = newMaterial;
        }
      });
    }
  }

  destroy(): void {
    // Performance cleanup: Properly dispose of all resources
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    // Clear auto-rotation resume timeout
    if (this.autoRotationResumeTimeout) {
      clearTimeout(this.autoRotationResumeTimeout);
      this.autoRotationResumeTimeout = undefined;
    }

    // Remove global mouse up listener
    document.removeEventListener('mouseup', this.handleGlobalMouseUp);

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer.domElement.remove();
    }

    if (this.scene) {
      this.scene.clear();
    }

    if (this.cube) {
      this.cube.geometry.dispose();
      if (Array.isArray(this.cube.material)) {
        this.cube.material.forEach(material => {
          const basicMaterial = material as THREE.MeshBasicMaterial;
          // Dispose of textures if they exist
          if (basicMaterial.map) {
            basicMaterial.map.dispose();
          }
          basicMaterial.dispose();
        });
      } else {
        const basicMaterial = this.cube.material as THREE.MeshBasicMaterial;
        // Dispose of texture if it exists
        if (basicMaterial.map) {
          basicMaterial.map.dispose();
        }
        basicMaterial.dispose();
      }
    }

    // Clean up wireframe objects
    if (this.wireframe) {
      this.wireframe.geometry.dispose();
      (this.wireframe.material as THREE.LineBasicMaterial).dispose();
    }

    if (this.glowWireframe) {
      this.glowWireframe.geometry.dispose();
      (this.glowWireframe.material as THREE.LineBasicMaterial).dispose();
    }

    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    const tooltip = document.getElementById('cube-tooltip');
    if (tooltip) {
      tooltip.remove();
    }

    // Clear references for garbage collection
    this.scene = null as any;
    this.camera = null as any;
    this.renderer = null as any;
    this.cube = null as any;
    this.wireframe = null as any;
    this.glowWireframe = null as any;
  }

  // Bound method for global mouse up listener
  private handleGlobalMouseUp = () => {
    if (this.isDragging) {
      this.isDragging = false;
      const canvas = this.renderer?.domElement;
      if (canvas) {
        canvas.style.cursor = 'default';
      }
      this.scheduleAutoRotationResume();
    }
  }
}

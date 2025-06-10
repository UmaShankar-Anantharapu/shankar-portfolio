import { Component, Inject, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from './project-card.component';
import { gsap } from 'gsap';
import * as Highcharts from 'highcharts';

interface ProjectDetailModalData {
  project: Project;
}

@Component({
  selector: 'app-project-detail-modal',
  template: `
    <div class="project-modal-container" [attr.aria-labelledby]="'modal-title-' + data.project.id">
      <!-- Modal Header -->
      <header class="modal-header">
        <div class="header-content">
          <div class="project-meta">
            <span class="company-badge">{{ data.project.company }}</span>
            <span class="category-badge">{{ data.project.category }}</span>
          </div>
          <h2 [id]="'modal-title-' + data.project.id" class="project-title">{{ data.project.title }}</h2>
          <p class="project-subtitle">{{ data.project.angularVersion }} • {{ data.project.duration }} • {{ data.project.teamSize }} team members</p>
        </div>
        <button 
          type="button" 
          class="close-btn"
          (click)="closeModal()"
          aria-label="Close modal"
          tabindex="0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>

      <!-- Modal Content -->
      <div class="modal-content">
        <!-- Navigation Tabs -->
        <nav class="modal-tabs" role="tablist" aria-label="Project details navigation">
          <button 
            *ngFor="let tab of tabs; let i = index"
            type="button"
            class="tab-button"
            [class.active]="activeTab === tab.id"
            [attr.aria-selected]="activeTab === tab.id"
            [attr.aria-controls]="'tab-panel-' + tab.id"
            [attr.id]="'tab-' + tab.id"
            role="tab"
            tabindex="0"
            (click)="setActiveTab(tab.id)"
            (keydown.enter)="setActiveTab(tab.id)"
            (keydown.space)="setActiveTab(tab.id)">
            <span class="tab-icon" [innerHTML]="tab.icon"></span>
            <span class="tab-label">{{ tab.label }}</span>
          </button>
        </nav>

        <!-- Tab Panels -->
        <div class="tab-content">
          <!-- Overview Tab -->
          <div 
            *ngIf="activeTab === 'overview'"
            class="tab-panel"
            id="tab-panel-overview"
            role="tabpanel"
            aria-labelledby="tab-overview">
            <div class="overview-content">
              <section class="description-section">
                <h3 class="section-title">Project Overview</h3>
                <p class="full-description">{{ data.project.fullDescription }}</p>
              </section>

              <section class="features-section">
                <h3 class="section-title">Key Features</h3>
                <ul class="features-list">
                  <li *ngFor="let feature of data.project.keyFeatures" class="feature-item">
                    <span class="feature-icon">✓</span>
                    <span class="feature-text">{{ feature }}</span>
                  </li>
                </ul>
              </section>

              <section class="role-section">
                <h3 class="section-title">My Role</h3>
                <p class="role-description">{{ data.project.myRole }}</p>
              </section>
            </div>
          </div>

          <!-- Technical Tab -->
          <div 
            *ngIf="activeTab === 'technical'"
            class="tab-panel"
            id="tab-panel-technical"
            role="tabpanel"
            aria-labelledby="tab-technical">
            <div class="technical-content">
              <section class="technologies-section">
                <h3 class="section-title">Technologies Used</h3>
                <div class="tech-grid">
                  <span *ngFor="let tech of data.project.technologies" class="tech-badge">
                    {{ tech }}
                  </span>
                </div>
              </section>

              <section class="challenges-section">
                <h3 class="section-title">Technical Challenges</h3>
                <ul class="challenges-list">
                  <li *ngFor="let challenge of data.project.challenges" class="challenge-item">
                    <span class="challenge-icon">⚡</span>
                    <span class="challenge-text">{{ challenge }}</span>
                  </li>
                </ul>
              </section>

              <section class="achievements-section">
                <h3 class="section-title">Key Achievements</h3>
                <ul class="achievements-list">
                  <li *ngFor="let achievement of data.project.achievements" class="achievement-item">
                    <span class="achievement-icon">🏆</span>
                    <span class="achievement-text">{{ achievement }}</span>
                  </li>
                </ul>
              </section>
            </div>
          </div>

          <!-- Demo Tab -->
          <div 
            *ngIf="activeTab === 'demo'"
            class="tab-panel"
            id="tab-panel-demo"
            role="tabpanel"
            aria-labelledby="tab-demo">
            <div class="demo-content">
              <!-- Project-specific Demo Content -->
              <ng-container [ngSwitch]="data.project.id">

                <!-- Celeste Demo -->
                <div *ngSwitchCase="'celeste'" class="celeste-demo">
                  <section class="demo-section">
                    <h3 class="section-title">Renewable Energy Dashboard</h3>
                    <div class="kpi-dashboard">
                      <div class="kpi-cards">
                        <div class="kpi-card solar">
                          <div class="kpi-icon">☀️</div>
                          <div class="kpi-content">
                            <h4 class="kpi-title">Solar Energy</h4>
                            <div class="kpi-value">
                              <span class="value">{{ solarValue }}</span>
                              <span class="unit">MW</span>
                            </div>
                            <div class="kpi-trend positive">↗ +12%</div>
                          </div>
                        </div>

                        <div class="kpi-card hydro">
                          <div class="kpi-icon">💧</div>
                          <div class="kpi-content">
                            <h4 class="kpi-title">Hydro Power</h4>
                            <div class="kpi-value">
                              <span class="value">{{ hydroValue }}</span>
                              <span class="unit">MW</span>
                            </div>
                            <div class="kpi-trend positive">↗ +8%</div>
                          </div>
                        </div>

                        <div class="kpi-card wind">
                          <div class="kpi-icon">💨</div>
                          <div class="kpi-content">
                            <h4 class="kpi-title">Wind Energy</h4>
                            <div class="kpi-value">
                              <span class="value">{{ windValue }}</span>
                              <span class="unit">MW</span>
                            </div>
                            <div class="kpi-trend positive">↗ +15%</div>
                          </div>
                        </div>
                      </div>

                      <div class="chart-container">
                        <h4 class="chart-title">Energy Production Trend</h4>
                        <div #celesteChart class="chart-element"></div>
                      </div>
                    </div>
                  </section>
                </div>

                <!-- ICO Sphere Demo -->
                <div *ngSwitchCase="'ico-sphere'" class="ico-sphere-demo">
                  <section class="demo-section">
                    <h3 class="section-title">3D Interactive Visualization</h3>
                    <div class="sphere-container">
                      <div #icoSphereDemo class="sphere-element"></div>
                      <div class="sphere-controls">
                        <button type="button" class="control-btn" (click)="toggleSphereAnimation()">
                          {{ sphereAnimating ? 'Pause' : 'Play' }} Animation
                        </button>
                        <button type="button" class="control-btn" (click)="resetSphereView()">
                          Reset View
                        </button>
                      </div>
                    </div>
                  </section>
                </div>

                <!-- IOT Dashboard Demo -->
                <div *ngSwitchCase="'iot-dashboard'" class="iot-demo">
                  <section class="demo-section">
                    <h3 class="section-title">IoT Device Monitoring</h3>
                    <div class="iot-dashboard">
                      <div class="device-grid">
                        <div class="device-card" *ngFor="let device of iotDevices; let i = index"
                             [class.online]="device.status === 'online'"
                             [class.offline]="device.status === 'offline'">
                          <div class="device-header">
                            <span class="device-icon">{{ device.icon }}</span>
                            <span class="device-name">{{ device.name }}</span>
                            <span class="device-status" [class]="device.status">{{ device.status }}</span>
                          </div>
                          <div class="device-metrics">
                            <div class="metric">
                              <span class="metric-label">Temperature</span>
                              <span class="metric-value">{{ device.temperature }}°C</span>
                            </div>
                            <div class="metric">
                              <span class="metric-label">Humidity</span>
                              <span class="metric-value">{{ device.humidity }}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                <!-- NH Cam Demo -->
                <div *ngSwitchCase="'nh-cam'" class="nh-cam-demo">
                  <section class="demo-section">
                    <h3 class="section-title">Camera Management System</h3>
                    <div class="camera-grid">
                      <div class="camera-feed" *ngFor="let camera of cameras; let i = index">
                        <div class="feed-header">
                          <span class="camera-name">{{ camera.name }}</span>
                          <span class="camera-status" [class]="camera.status">{{ camera.status }}</span>
                        </div>
                        <div class="feed-content">
                          <div class="video-placeholder">
                            <div class="play-icon">▶</div>
                            <div class="feed-info">{{ camera.resolution }}</div>
                          </div>
                        </div>
                        <div class="feed-controls">
                          <button type="button" class="feed-btn">Record</button>
                          <button type="button" class="feed-btn">Snapshot</button>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                <!-- CIS Demo -->
                <div *ngSwitchCase="'cis'" class="cis-demo">
                  <section class="demo-section">
                    <h3 class="section-title">Customer Management Interface</h3>
                    <div class="cis-dashboard">
                      <div class="customer-stats">
                        <div class="stat-card">
                          <div class="stat-number">{{ customerStats.total }}</div>
                          <div class="stat-label">Total Customers</div>
                        </div>
                        <div class="stat-card">
                          <div class="stat-number">{{ customerStats.active }}</div>
                          <div class="stat-label">Active This Month</div>
                        </div>
                        <div class="stat-card">
                          <div class="stat-number">{{ customerStats.new }}</div>
                          <div class="stat-label">New Customers</div>
                        </div>
                      </div>

                      <div class="customer-table">
                        <div class="table-header">
                          <span>Customer Name</span>
                          <span>Status</span>
                          <span>Last Activity</span>
                        </div>
                        <div class="table-row" *ngFor="let customer of customers">
                          <span class="customer-name">{{ customer.name }}</span>
                          <span class="customer-status" [class]="customer.status">{{ customer.status }}</span>
                          <span class="customer-activity">{{ customer.lastActivity }}</span>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                <!-- Career Trek Demo -->
                <div *ngSwitchCase="'career-trek'" class="career-trek-demo">
                  <section class="demo-section">
                    <h3 class="section-title">Job Matching & Resume Builder</h3>
                    <div class="career-interface">
                      <div class="job-matching">
                        <h4 class="section-subtitle">Job Recommendations</h4>
                        <div class="job-cards">
                          <div class="job-card" *ngFor="let job of jobRecommendations">
                            <div class="job-title">{{ job.title }}</div>
                            <div class="job-company">{{ job.company }}</div>
                            <div class="job-match">{{ job.match }}% Match</div>
                            <div class="job-skills">
                              <span class="skill-tag" *ngFor="let skill of job.skills">{{ skill }}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="resume-builder">
                        <h4 class="section-subtitle">Resume Builder Preview</h4>
                        <div class="resume-preview">
                          <div class="resume-section">
                            <h5>Professional Summary</h5>
                            <p>Experienced software developer with expertise in modern web technologies...</p>
                          </div>
                          <div class="resume-section">
                            <h5>Skills</h5>
                            <div class="skill-list">
                              <span class="skill-item" *ngFor="let skill of resumeSkills">{{ skill }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                <!-- Photoshooto Demo -->
                <div *ngSwitchCase="'photoshooto'" class="photoshooto-demo">
                  <section class="demo-section">
                    <h3 class="section-title">Photography Portfolio Gallery</h3>
                    <div class="portfolio-gallery">
                      <div class="gallery-grid">
                        <div class="photo-item" *ngFor="let photo of portfolioPhotos; let i = index"
                             (click)="selectPhoto(i)">
                          <div class="photo-placeholder">
                            <div class="photo-icon">📷</div>
                            <div class="photo-info">{{ photo.category }}</div>
                          </div>
                          <div class="photo-overlay">
                            <span class="photo-title">{{ photo.title }}</span>
                          </div>
                        </div>
                      </div>

                      <div class="booking-section">
                        <h4 class="section-subtitle">Book a Session</h4>
                        <div class="booking-form">
                          <div class="form-row">
                            <label>Session Type</label>
                            <select class="form-select">
                              <option>Portrait Photography</option>
                              <option>Wedding Photography</option>
                              <option>Event Photography</option>
                            </select>
                          </div>
                          <div class="form-row">
                            <label>Preferred Date</label>
                            <input type="date" class="form-input">
                          </div>
                          <button type="button" class="booking-btn">Check Availability</button>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                <!-- Default Demo -->
                <div *ngSwitchDefault class="default-demo">
                  <section class="demo-section">
                    <h3 class="section-title">Live Demo</h3>
                    <div class="demo-placeholder">
                      <div class="demo-icon">🚀</div>
                      <p class="demo-text">Interactive demo available</p>
                      <button
                        *ngIf="data.project.demoUrl"
                        type="button"
                        class="demo-btn"
                        (click)="openDemo()">
                        View Live Demo
                      </button>
                    </div>
                  </section>
                </div>
              </ng-container>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <footer class="modal-footer">
        <div class="footer-actions">
          <button 
            *ngIf="data.project.demoUrl"
            type="button"
            class="action-btn primary"
            (click)="openDemo()">
            <span class="btn-icon">🔗</span>
            <span class="btn-text">Live Demo</span>
          </button>
          
          <button 
            *ngIf="data.project.sourceCodeUrl"
            type="button"
            class="action-btn secondary"
            (click)="openSourceCode()">
            <span class="btn-icon">💻</span>
            <span class="btn-text">Source Code</span>
          </button>
          
          <button 
            type="button"
            class="action-btn tertiary"
            (click)="closeModal()">
            <span class="btn-icon">✕</span>
            <span class="btn-text">Close</span>
          </button>
        </div>
      </footer>
    </div>
  `,
  styleUrls: ['./project-detail-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDetailModalComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('celesteChart', { static: false }) celesteChart!: ElementRef;
  @ViewChild('icoSphereDemo', { static: false }) icoSphereDemo!: ElementRef;

  activeTab = 'overview';

  tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'technical', label: 'Technical', icon: '⚙️' },
    { id: 'demo', label: 'Demo', icon: '🎮' }
  ];

  // Demo data properties
  solarValue = 300;
  hydroValue = 450;
  windValue = 200;
  sphereAnimating = true;

  // IoT Demo data
  iotDevices = [
    { name: 'Temperature Sensor 1', icon: '🌡️', status: 'online', temperature: 23.5, humidity: 45 },
    { name: 'Humidity Sensor 2', icon: '💧', status: 'online', temperature: 22.1, humidity: 52 },
    { name: 'Motion Detector 3', icon: '👁️', status: 'offline', temperature: 0, humidity: 0 },
    { name: 'Air Quality Monitor', icon: '🌬️', status: 'online', temperature: 24.2, humidity: 48 }
  ];

  // Camera Demo data
  cameras = [
    { name: 'Front Entrance', status: 'live', resolution: '1080p' },
    { name: 'Parking Lot', status: 'live', resolution: '720p' },
    { name: 'Back Exit', status: 'offline', resolution: '1080p' },
    { name: 'Conference Room', status: 'live', resolution: '4K' }
  ];

  // CIS Demo data
  customerStats = { total: 15420, active: 8934, new: 234 };
  customers = [
    { name: 'John Smith', status: 'active', lastActivity: '2 hours ago' },
    { name: 'Sarah Johnson', status: 'inactive', lastActivity: '1 day ago' },
    { name: 'Mike Wilson', status: 'active', lastActivity: '30 minutes ago' },
    { name: 'Emily Davis', status: 'pending', lastActivity: '3 days ago' }
  ];

  // Career Trek Demo data
  jobRecommendations = [
    { title: 'Senior Frontend Developer', company: 'Tech Corp', match: 95, skills: ['Angular', 'TypeScript', 'RxJS'] },
    { title: 'Full Stack Engineer', company: 'StartupXYZ', match: 87, skills: ['React', 'Node.js', 'MongoDB'] },
    { title: 'UI/UX Developer', company: 'Design Studio', match: 78, skills: ['JavaScript', 'CSS', 'Figma'] }
  ];

  resumeSkills = ['Angular', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Node.js', 'MongoDB'];

  // Photoshooto Demo data
  portfolioPhotos = [
    { title: 'Wedding Ceremony', category: 'Wedding' },
    { title: 'Corporate Headshots', category: 'Portrait' },
    { title: 'Product Showcase', category: 'Commercial' },
    { title: 'Nature Landscape', category: 'Landscape' },
    { title: 'Event Coverage', category: 'Event' },
    { title: 'Fashion Shoot', category: 'Fashion' }
  ];

  private chart?: Highcharts.Chart;

  constructor(
    public dialogRef: MatDialogRef<ProjectDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectDetailModalData
  ) {}

  ngOnInit(): void {
    // Add entrance animation
    this.animateEntrance();

    // Set up keyboard navigation
    this.setupKeyboardNavigation();

    // Start demo animations
    this.startDemoAnimations();
  }

  ngAfterViewInit(): void {
    // Initialize demos based on active tab and project
    if (this.activeTab === 'demo') {
      this.initializeDemos();
    }
  }

  ngOnDestroy(): void {
    // Cleanup any animations
    gsap.killTweensOf('.project-modal-container');
  }

  setActiveTab(tabId: string): void {
    if (this.activeTab !== tabId) {
      this.activeTab = tabId;
      this.animateTabChange();

      // Initialize demos when switching to demo tab
      if (tabId === 'demo') {
        setTimeout(() => this.initializeDemos(), 100);
      }
    }
  }

  closeModal(): void {
    this.animateExit().then(() => {
      this.dialogRef.close();
    });
  }

  openDemo(): void {
    if (this.data.project.demoUrl) {
      window.open(this.data.project.demoUrl, '_blank', 'noopener,noreferrer');
    }
  }

  openSourceCode(): void {
    if (this.data.project.sourceCodeUrl) {
      window.open(this.data.project.sourceCodeUrl, '_blank', 'noopener,noreferrer');
    }
  }

  // Demo interaction methods
  toggleSphereAnimation(): void {
    this.sphereAnimating = !this.sphereAnimating;
    // Add actual sphere animation toggle logic here
  }

  resetSphereView(): void {
    // Add sphere view reset logic here
    console.log('Resetting sphere view');
  }

  selectPhoto(index: number): void {
    console.log(`Selected photo ${index + 1}: ${this.portfolioPhotos[index].title}`);
  }

  // Demo initialization and animations
  private startDemoAnimations(): void {
    // Animate KPI values for Celeste
    if (this.data.project.id === 'celeste') {
      this.animateKPIValues();
    }

    // Start IoT device status updates
    if (this.data.project.id === 'iot-dashboard') {
      this.startIoTUpdates();
    }
  }

  private initializeDemos(): void {
    switch (this.data.project.id) {
      case 'celeste':
        this.initCelesteChart();
        break;
      case 'ico-sphere':
        this.initIcoSphere();
        break;
      default:
        break;
    }
  }

  private animateKPIValues(): void {
    // Animate solar value
    gsap.to(this, {
      solarValue: 300,
      duration: 2,
      ease: 'power2.out'
    });

    // Animate hydro value with delay
    gsap.to(this, {
      hydroValue: 450,
      duration: 2,
      delay: 0.5,
      ease: 'power2.out'
    });

    // Animate wind value with delay
    gsap.to(this, {
      windValue: 200,
      duration: 2,
      delay: 1,
      ease: 'power2.out'
    });
  }

  private startIoTUpdates(): void {
    // Simulate real-time IoT updates
    setInterval(() => {
      this.iotDevices.forEach(device => {
        if (device.status === 'online') {
          device.temperature += (Math.random() - 0.5) * 2;
          device.humidity += (Math.random() - 0.5) * 5;
          device.temperature = Math.round(device.temperature * 10) / 10;
          device.humidity = Math.max(0, Math.min(100, Math.round(device.humidity)));
        }
      });
    }, 3000);
  }

  private initCelesteChart(): void {
    if (!this.celesteChart?.nativeElement) return;

    const chartOptions: Highcharts.Options = {
      chart: {
        type: 'line',
        backgroundColor: 'transparent',
        height: 300
      },
      title: {
        text: 'Energy Production Trend',
        style: { color: '#26a69a' }
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        labels: { style: { color: '#ffffff' } }
      },
      yAxis: {
        title: { text: 'Energy (MW)', style: { color: '#ffffff' } },
        labels: { style: { color: '#ffffff' } }
      },
      legend: {
        itemStyle: { color: '#ffffff' }
      },
      series: [{
        name: 'Solar',
        type: 'line',
        data: [250, 280, 300, 320, 310, 300],
        color: '#ffc107'
      }, {
        name: 'Hydro',
        type: 'line',
        data: [400, 420, 450, 460, 455, 450],
        color: '#2196f3'
      }, {
        name: 'Wind',
        type: 'line',
        data: [150, 180, 200, 220, 210, 200],
        color: '#26a69a'
      }]
    };

    this.chart = Highcharts.chart(this.celesteChart.nativeElement, chartOptions);
  }

  private initIcoSphere(): void {
    if (!this.icoSphereDemo?.nativeElement) return;

    // Simple sphere visualization placeholder
    this.icoSphereDemo.nativeElement.innerHTML = `
      <div style="
        width: 200px;
        height: 200px;
        border-radius: 50%;
        background: linear-gradient(45deg, #26a69a, #1e8a7a);
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: 'Orbitron', sans-serif;
        animation: ${this.sphereAnimating ? 'rotate 4s linear infinite' : 'none'};
      ">
        3D Sphere
      </div>
      <style>
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    `;
  }

  private animateEntrance(): void {
    const container = document.querySelector('.project-modal-container');
    if (container) {
      gsap.fromTo(container,
        {
          opacity: 0,
          scale: 0.9,
          y: 30
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out'
        }
      );
    }
  }

  private animateExit(): Promise<void> {
    return new Promise((resolve) => {
      const container = document.querySelector('.project-modal-container');
      if (container) {
        gsap.to(container, {
          opacity: 0,
          scale: 0.9,
          y: -30,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: resolve
        });
      } else {
        resolve();
      }
    });
  }

  private animateTabChange(): void {
    const tabPanel = document.querySelector('.tab-panel');
    if (tabPanel) {
      gsap.fromTo(tabPanel,
        {
          opacity: 0,
          x: 20
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.3,
          ease: 'power2.out'
        }
      );
    }
  }

  private setupKeyboardNavigation(): void {
    // Add keyboard navigation for tabs
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal();
    }
    
    // Tab navigation with arrow keys
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      const currentIndex = this.tabs.findIndex(tab => tab.id === this.activeTab);
      let newIndex;
      
      if (event.key === 'ArrowLeft') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : this.tabs.length - 1;
      } else {
        newIndex = currentIndex < this.tabs.length - 1 ? currentIndex + 1 : 0;
      }
      
      this.setActiveTab(this.tabs[newIndex].id);
      
      // Focus the new tab
      const newTabButton = document.getElementById(`tab-${this.tabs[newIndex].id}`);
      if (newTabButton) {
        newTabButton.focus();
      }
    }
  }
}

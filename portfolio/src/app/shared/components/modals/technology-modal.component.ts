import { Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import * as Highcharts from 'highcharts';
import { gsap } from 'gsap';

export interface TechnologyModalData {
  technology: string;
  title: string;
  description: string;
  responsibilities: string[];
  demoType: 'chart' | 'grid' | 'flowchart' | 'stream' | 'gridster' | 'sphere';
}

@Component({
  selector: 'app-technology-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="modal-container">
      <div class="modal-header">
        <h2 mat-dialog-title>{{ data.title }}</h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <div mat-dialog-content class="modal-content">
        <p class="description">{{ data.description }}</p>
        
        <div class="responsibilities">
          <h3>Responsibilities:</h3>
          <ul>
            <li *ngFor="let responsibility of data.responsibilities">{{ responsibility }}</li>
          </ul>
        </div>
        
        <div class="demo-container" #demoContainer>
          <h3>Demo:</h3>
          <div class="demo-content" [ngSwitch]="data.demoType">
            
            <!-- Highcharts Demo -->
            <div *ngSwitchCase="'chart'" #chartContainer class="chart-container"></div>
            
            <!-- AG-Grid Demo -->
            <div *ngSwitchCase="'grid'" class="grid-container">
              <div class="grid-demo">
                <table class="demo-table">
                  <thead>
                    <tr>
                      <th>Energy Source</th>
                      <th>Capacity (MW)</th>
                      <th>Efficiency (%)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Solar</td>
                      <td>300</td>
                      <td>85</td>
                      <td>Active</td>
                    </tr>
                    <tr>
                      <td>Hydro</td>
                      <td>450</td>
                      <td>92</td>
                      <td>Active</td>
                    </tr>
                    <tr>
                      <td>Wind</td>
                      <td>200</td>
                      <td>78</td>
                      <td>Maintenance</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- MFE Architecture Flowchart -->
            <div *ngSwitchCase="'flowchart'" class="flowchart-container">
              <div class="mfe-diagram">
                <div class="mfe-shell">Shell App</div>
                <div class="mfe-apps">
                  <div class="mfe-app">Celeste MFE</div>
                  <div class="mfe-app">IOT Dashboard MFE</div>
                  <div class="mfe-app">Analytics MFE</div>
                </div>
              </div>
            </div>
            
            <!-- RxJS Stream Visualization -->
            <div *ngSwitchCase="'stream'" class="stream-container">
              <div class="stream-demo">
                <div class="stream-line">
                  <div class="stream-item" *ngFor="let item of streamItems">{{ item }}</div>
                </div>
              </div>
            </div>
            
            <!-- Gridster Demo -->
            <div *ngSwitchCase="'gridster'" class="gridster-container">
              <div class="gridster-demo">
                <div class="grid-item" *ngFor="let item of gridItems">
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.content }}</p>
                </div>
              </div>
            </div>
            
            <!-- Three.js Sphere Demo -->
            <div *ngSwitchCase="'sphere'" #sphereContainer class="sphere-container"></div>
            
          </div>
        </div>
      </div>
      
      <div mat-dialog-actions class="modal-actions">
        <button mat-button (click)="close()">Close</button>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      max-width: 800px;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .modal-content {
      padding: 1.5rem;
    }
    
    .description {
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
      color: #666;
    }
    
    .responsibilities {
      margin-bottom: 2rem;
    }
    
    .responsibilities h3 {
      color: var(--secondary-color);
      margin-bottom: 0.5rem;
    }
    
    .responsibilities ul {
      list-style-type: disc;
      padding-left: 1.5rem;
    }
    
    .responsibilities li {
      margin-bottom: 0.5rem;
    }
    
    .demo-container h3 {
      color: var(--secondary-color);
      margin-bottom: 1rem;
    }
    
    .chart-container {
      height: 300px;
      width: 100%;
    }
    
    .demo-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    
    .demo-table th,
    .demo-table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    
    .demo-table th {
      background-color: var(--secondary-color);
      color: white;
    }
    
    .mfe-diagram {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }
    
    .mfe-shell {
      background: var(--primary-color);
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: bold;
    }
    
    .mfe-apps {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .mfe-app {
      background: var(--secondary-color);
      color: white;
      padding: 0.8rem 1.5rem;
      border-radius: 6px;
      font-size: 0.9rem;
    }
    
    .stream-demo {
      height: 100px;
      overflow: hidden;
      border: 2px solid var(--secondary-color);
      border-radius: 8px;
      position: relative;
    }
    
    .stream-line {
      display: flex;
      animation: streamFlow 3s linear infinite;
    }
    
    .stream-item {
      background: var(--secondary-color);
      color: white;
      padding: 0.5rem 1rem;
      margin: 0.5rem;
      border-radius: 4px;
      white-space: nowrap;
    }
    
    @keyframes streamFlow {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
    
    .gridster-demo {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      min-height: 200px;
    }
    
    .grid-item {
      background: #f5f5f5;
      border: 2px solid var(--secondary-color);
      border-radius: 8px;
      padding: 1rem;
      cursor: move;
      transition: transform 0.2s;
    }
    
    .grid-item:hover {
      transform: scale(1.02);
    }
    
    .sphere-container {
      height: 300px;
      width: 100%;
      background: #000;
      border-radius: 8px;
    }
    
    .modal-actions {
      padding: 1rem;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class TechnologyModalComponent implements OnInit, AfterViewInit {
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @ViewChild('sphereContainer') sphereContainer!: ElementRef;
  @ViewChild('demoContainer') demoContainer!: ElementRef;

  streamItems = ['Data 1', 'Data 2', 'Data 3', 'Data 4', 'Data 5'];
  gridItems = [
    { title: 'Widget 1', content: 'Draggable content' },
    { title: 'Widget 2', content: 'Resizable panel' },
    { title: 'Widget 3', content: 'Dashboard item' },
    { title: 'Widget 4', content: 'Chart widget' }
  ];

  constructor(
    public dialogRef: MatDialogRef<TechnologyModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TechnologyModalData
  ) {}

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    // Animate modal entrance
    gsap.fromTo(this.demoContainer.nativeElement, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.2 }
    );

    // Initialize demos based on type
    setTimeout(() => {
      if (this.data.demoType === 'chart' && this.chartContainer) {
        this.initHighchart();
      } else if (this.data.demoType === 'sphere' && this.sphereContainer) {
        this.initThreeSphere();
      }
    }, 100);
  }

  private initHighchart(): void {
    // Lightweight Highcharts configuration for optimal performance
    const chartOptions: Highcharts.Options = {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        animation: false, // Disable animations for better performance
        height: 250
      },
      title: {
        text: 'Renewable Energy Capacity',
        style: { fontSize: '14px' }
      },
      credits: { enabled: false }, // Remove credits for cleaner look
      legend: { enabled: false }, // Remove legend for simplicity
      plotOptions: {
        column: {
          animation: false, // Disable column animations
          dataLabels: {
            enabled: true,
            format: '{y} MW'
          }
        }
      },
      xAxis: {
        categories: ['Solar', 'Hydro', 'Wind'],
        title: { text: null }
      },
      yAxis: {
        title: { text: 'Capacity (MW)' },
        min: 0
      },
      series: [{
        name: 'Energy Sources',
        type: 'column',
        data: [300, 450, 200],
        color: '#26A69A'
      }],
      // Performance optimizations
      boost: {
        useGPUTranslations: true
      }
    };

    Highcharts.chart(this.chartContainer.nativeElement, chartOptions);
  }

  private initThreeSphere(): void {
    // Three.js sphere implementation would go here
    // For now, just show a placeholder
    this.sphereContainer.nativeElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white;">Three.js Sphere Demo</div>';
  }

  close(): void {
    this.dialogRef.close();
  }
}

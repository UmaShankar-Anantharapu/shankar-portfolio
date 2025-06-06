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
import * as Highcharts from 'highcharts';
import { gsap } from 'gsap';

@Component({
  selector: 'app-highcharts-demo-modal',
  template: `
    <div class="highcharts-demo-modal">
      <div class="modal-header">
        <div class="header-content">
          <span class="skill-icon">📊</span>
          <div class="header-text">
            <h2 class="skill-title">Highcharts Demo</h2>
            <p class="skill-subtitle">Renewable Energy KPI Dashboard</p>
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
        <!-- KPI Cards -->
        <div class="kpi-cards">
          <div class="kpi-card solar" #solarCard>
            <div class="kpi-icon">☀️</div>
            <div class="kpi-content">
              <h3 class="kpi-title">Solar Energy</h3>
              <div class="kpi-value">
                <span class="value" #solarValue>0</span>
                <span class="unit">MW</span>
              </div>
              <div class="kpi-trend positive">↗ +12%</div>
            </div>
          </div>
          
          <div class="kpi-card hydro" #hydroCard>
            <div class="kpi-icon">💧</div>
            <div class="kpi-content">
              <h3 class="kpi-title">Hydro Power</h3>
              <div class="kpi-value">
                <span class="value" #hydroValue>0</span>
                <span class="unit">MW</span>
              </div>
              <div class="kpi-trend positive">↗ +8%</div>
            </div>
          </div>
          
          <div class="kpi-card wind" #windCard>
            <div class="kpi-icon">💨</div>
            <div class="kpi-content">
              <h3 class="kpi-title">Wind Energy</h3>
              <div class="kpi-value">
                <span class="value" #windValue>0</span>
                <span class="unit">MW</span>
              </div>
              <div class="kpi-trend positive">↗ +15%</div>
            </div>
          </div>
        </div>

        <!-- Highcharts Container -->
        <div class="chart-section">
          <h3 class="chart-title">Energy Production Overview</h3>
          <div #chartContainer class="chart-container"></div>
        </div>
      </div>
      
      <div class="modal-actions">
        <button type="button" class="action-btn secondary" (click)="refreshData()">
          🔄 Refresh Data
        </button>
        <button type="button" class="action-btn primary" (click)="closeModal()">
          Close Demo
        </button>
      </div>
    </div>
  `,
  styles: [`
    .highcharts-demo-modal {
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

    .kpi-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .kpi-card {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid rgba(38, 166, 154, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .kpi-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
      border-color: rgba(38, 166, 154, 0.3);
    }

    .kpi-card.solar { border-left: 4px solid #ffa726; }
    .kpi-card.hydro { border-left: 4px solid #42a5f5; }
    .kpi-card.wind { border-left: 4px solid #66bb6a; }

    .kpi-icon {
      font-size: 2rem;
      opacity: 0.8;
    }

    .kpi-content {
      flex: 1;
    }

    .kpi-title {
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      color: var(--text-color-secondary);
      margin: 0 0 0.5rem 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .kpi-value {
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
      margin-bottom: 0.5rem;
    }

    .value {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--secondary-color);
    }

    .unit {
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      color: var(--text-color-secondary);
    }

    .kpi-trend {
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .kpi-trend.positive {
      color: #66bb6a;
    }

    .chart-section {
      background: rgba(255, 255, 255, 0.02);
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid rgba(38, 166, 154, 0.1);
    }

    .chart-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.2rem;
      color: var(--secondary-color);
      margin: 0 0 1rem 0;
      text-align: center;
    }

    .chart-container {
      height: 300px;
      width: 100%;
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
      .kpi-cards {
        grid-template-columns: 1fr;
      }
      
      .modal-content {
        padding: 1.5rem;
      }
      
      .chart-container {
        height: 250px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HighchartsDemoModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  @ViewChild('solarCard', { static: false }) solarCard!: ElementRef;
  @ViewChild('hydroCard', { static: false }) hydroCard!: ElementRef;
  @ViewChild('windCard', { static: false }) windCard!: ElementRef;
  @ViewChild('solarValue', { static: false }) solarValue!: ElementRef;
  @ViewChild('hydroValue', { static: false }) hydroValue!: ElementRef;
  @ViewChild('windValue', { static: false }) windValue!: ElementRef;

  private chart: Highcharts.Chart | null = null;
  private readonly energyData = {
    solar: 300,
    hydro: 450,
    wind: 200
  };

  constructor(
    private readonly dialogRef: MatDialogRef<HighchartsDemoModalComponent>,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initializeChart();
        this.animateKPICards();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private initializeChart(): void {
    if (!this.chartContainer?.nativeElement) return;

    const options: Highcharts.Options = {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'Inter, sans-serif'
        }
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: ['Solar', 'Hydro', 'Wind'],
        labels: {
          style: {
            color: '#ffffff',
            fontSize: '12px'
          }
        },
        lineColor: 'rgba(38, 166, 154, 0.3)',
        tickColor: 'rgba(38, 166, 154, 0.3)'
      },
      yAxis: {
        title: {
          text: 'Power Output (MW)',
          style: {
            color: '#26a69a',
            fontSize: '12px'
          }
        },
        labels: {
          style: {
            color: '#ffffff',
            fontSize: '11px'
          }
        },
        gridLineColor: 'rgba(38, 166, 154, 0.2)'
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        column: {
          borderRadius: 4,
          dataLabels: {
            enabled: true,
            style: {
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 'bold'
            }
          }
        }
      },
      series: [{
        type: 'column',
        name: 'Energy Production',
        data: [
          { y: this.energyData.solar, color: '#ffa726' },
          { y: this.energyData.hydro, color: '#42a5f5' },
          { y: this.energyData.wind, color: '#66bb6a' }
        ]
      }],
      credits: {
        enabled: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        style: {
          color: '#ffffff'
        },
        borderColor: '#26a69a'
      }
    };

    this.chart = Highcharts.chart(this.chartContainer.nativeElement, options);
  }

  private animateKPICards(): void {
    // Animate KPI cards entrance
    const cards = [this.solarCard, this.hydroCard, this.windCard];
    const values = [this.solarValue, this.hydroValue, this.windValue];
    const targets = [this.energyData.solar, this.energyData.hydro, this.energyData.wind];

    cards.forEach((card, index) => {
      if (card?.nativeElement) {
        gsap.fromTo(card.nativeElement,
          {
            opacity: 0,
            y: 30,
            scale: 0.9
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: index * 0.2,
            ease: 'power2.out'
          }
        );
      }
    });

    // Animate KPI values counting up
    values.forEach((valueElement, index) => {
      if (valueElement?.nativeElement) {
        const obj = { value: 0 };
        gsap.to(obj, {
          value: targets[index],
          duration: 2,
          delay: 0.5 + (index * 0.2),
          ease: 'power2.out',
          onUpdate: () => {
            valueElement.nativeElement.textContent = Math.round(obj.value);
          }
        });
      }
    });
  }

  refreshData(): void {
    // Simulate data refresh with random variations
    const variations = [0.9, 1.1]; // ±10% variation
    const newData = {
      solar: Math.round(this.energyData.solar * (variations[Math.floor(Math.random() * variations.length)])),
      hydro: Math.round(this.energyData.hydro * (variations[Math.floor(Math.random() * variations.length)])),
      wind: Math.round(this.energyData.wind * (variations[Math.floor(Math.random() * variations.length)]))
    };

    // Update chart
    if (this.chart) {
      this.chart.series[0].setData([
        { y: newData.solar, color: '#ffa726' },
        { y: newData.hydro, color: '#42a5f5' },
        { y: newData.wind, color: '#66bb6a' }
      ]);
    }

    // Update KPI values with animation
    const values = [this.solarValue, this.hydroValue, this.windValue];
    const targets = [newData.solar, newData.hydro, newData.wind];

    values.forEach((valueElement, index) => {
      if (valueElement?.nativeElement) {
        const currentValue = parseInt(valueElement.nativeElement.textContent || '0');
        const obj = { value: currentValue };
        
        gsap.to(obj, {
          value: targets[index],
          duration: 1,
          ease: 'power2.out',
          onUpdate: () => {
            valueElement.nativeElement.textContent = Math.round(obj.value);
          }
        });
      }
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}

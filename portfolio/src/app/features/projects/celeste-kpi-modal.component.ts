import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SkillsNavigationService } from '../../core/services/skills-navigation.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-celeste-kpi-modal',
  template: `
    <div class="kpi-modal-container">
      <mat-card class="kpi-card">
        <mat-card-header class="kpi-header">
          <div mat-card-avatar class="kpi-avatar">
            <mat-icon class="kpi-icon">energy_savings_leaf</mat-icon>
          </div>
          <mat-card-title class="kpi-title">Renewable Energy Dashboard</mat-card-title>
          <mat-card-subtitle class="kpi-subtitle">Real-time Energy Production Monitoring</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content class="kpi-content">
          <!-- Main KPI Display -->
          <div class="main-kpi">
            <div class="kpi-label">Total Energy Production</div>
            <div class="kpi-value">
              <span class="kpi-number">950</span>
              <span class="kpi-unit">MW</span>
            </div>
            <div class="kpi-trend">
              <mat-icon class="trend-icon positive">trending_up</mat-icon>
              <span class="trend-text">+12.5% from last month</span>
            </div>
          </div>

          <!-- Mini Chart Container -->
          <div class="chart-container">
            <h4 class="chart-title">Energy Source Distribution</h4>
            <div #chartContainer class="chart-element"></div>
          </div>

          <!-- Additional KPIs -->
          <div class="additional-kpis">
            <div class="kpi-item">
              <div class="kpi-item-label">Solar Energy</div>
              <div class="kpi-item-value">300 MW</div>
              <div class="kpi-item-percentage">31.6%</div>
            </div>
            <div class="kpi-item">
              <div class="kpi-item-label">Hydro Energy</div>
              <div class="kpi-item-value">450 MW</div>
              <div class="kpi-item-percentage">47.4%</div>
            </div>
            <div class="kpi-item">
              <div class="kpi-item-label">Wind Energy</div>
              <div class="kpi-item-value">200 MW</div>
              <div class="kpi-item-percentage">21.0%</div>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions class="kpi-actions">
          <button mat-raised-button color="primary" (click)="viewFullDashboard()">
            <mat-icon>dashboard</mat-icon>
            View Full Dashboard
          </button>
          <button mat-button color="accent" (click)="viewSkills()">
            <mat-icon>code</mat-icon>
            View Skills Used
          </button>
          <button mat-button (click)="closeModal()">
            <mat-icon>close</mat-icon>
            Close
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .kpi-modal-container {
      padding: 0;
      margin: 0;
      max-width: 450px;
      width: 100%;
      height: auto;
      max-height: 75vh;
      display: flex;
      flex-direction: column;
    }

    .kpi-card {
      background: var(--primary-color);
      color: var(--text-color);
      border: 1px solid rgba(38, 166, 154, 0.2);
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(38, 166, 154, 0.1);
      display: flex;
      flex-direction: column;
    }

    .kpi-header {
      border-bottom: 1px solid rgba(38, 166, 154, 0.2);
      padding: 0.5rem 0.75rem 0.25rem 0.75rem;
      flex-shrink: 0;
    }

    .kpi-avatar {
      background: var(--secondary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .kpi-icon {
      font-size: 1.5rem;
    }

    .kpi-title {
      font-family: 'Orbitron', sans-serif;
      color: var(--secondary-color);
      font-size: 1.5rem;
      font-weight: 600;
    }

    .kpi-subtitle {
      color: var(--text-color-secondary);
      font-family: 'Inter', sans-serif;
    }

    .kpi-content {
      padding: 0.5rem 0.75rem;
      display: flex;
      flex-direction: column;
    }

    .main-kpi {
      text-align: center;
      margin-bottom: 0.5rem;
      padding: 0.5rem;
      background: rgba(38, 166, 154, 0.05);
      border-radius: 8px;
      border: 1px solid rgba(38, 166, 154, 0.1);
    }

    .kpi-label {
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      color: var(--text-color-secondary);
      margin-bottom: 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .kpi-value {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .kpi-number {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--secondary-color);
      line-height: 1;
    }

    .kpi-unit {
      font-family: 'Inter', sans-serif;
      font-size: 1.2rem;
      color: var(--text-color);
      font-weight: 500;
    }

    .kpi-trend {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .trend-icon {
      font-size: 1.2rem;
    }

    .trend-icon.positive {
      color: #4caf50;
    }

    .trend-text {
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      color: #4caf50;
      font-weight: 500;
    }

    .chart-container {
      margin-bottom: 0.5rem;
    }

    .chart-title {
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      color: var(--text-color);
      margin-bottom: 0.25rem;
      text-align: center;
    }

    .chart-element {
      height: 140px;
      width: 100%;
    }

    .additional-kpis {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.25rem;
      margin-bottom: 0.25rem;
    }

    .kpi-item {
      text-align: center;
      padding: 0.25rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .kpi-item-label {
      font-family: 'Inter', sans-serif;
      font-size: 0.7rem;
      color: var(--text-color-secondary);
      margin-bottom: 0.25rem;
    }

    .kpi-item-value {
      font-family: 'Orbitron', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      color: var(--secondary-color);
      margin-bottom: 0.1rem;
    }

    .kpi-item-percentage {
      font-family: 'Inter', sans-serif;
      font-size: 0.7rem;
      color: var(--text-color-secondary);
    }

    .kpi-actions {
      padding: 0.25rem 0.75rem;
      border-top: 1px solid rgba(38, 166, 154, 0.2);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.25rem;
    }

    @media (max-width: 768px) {
      .kpi-modal-container {
        max-width: 95vw;
        max-height: 85vh;
      }

      .additional-kpis {
        grid-template-columns: 1fr;
        gap: 0.2rem;
      }

      .kpi-number {
        font-size: 1.4rem;
      }

      .chart-element {
        height: 120px;
      }

      .kpi-actions {
        flex-direction: column;
        gap: 0.2rem;
        padding: 0.25rem 0.5rem;
      }

      .kpi-content {
        padding: 0.25rem 0.5rem;
      }

      .main-kpi {
        padding: 0.25rem;
        margin-bottom: 0.25rem;
      }

      .kpi-header {
        padding: 0.25rem 0.5rem;
      }

      .kpi-item {
        padding: 0.2rem;
      }

      .chart-title {
        font-size: 0.7rem;
        margin-bottom: 0.2rem;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CelesteKpiModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  
  private chart: Highcharts.Chart | undefined;

  constructor(
    private readonly dialogRef: MatDialogRef<CelesteKpiModalComponent>,
    private readonly skillsNavigationService: SkillsNavigationService
  ) {}

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    // Initialize chart after view is ready
    setTimeout(() => {
      this.initChart();
    }, 100);
  }

  ngOnDestroy(): void {
    // Clean up chart
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private initChart(): void {
    if (!this.chartContainer?.nativeElement) return;

    const chartOptions: Highcharts.Options = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: 140
      },
      title: {
        text: undefined
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#26a69a',
        style: {
          color: '#ffffff',
          fontFamily: 'Inter, sans-serif'
        },
        pointFormat: '<b>{point.y} MW</b><br/>({point.percentage:.1f}%)'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b><br/>{point.y} MW',
            style: {
              color: '#ffffff',
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px'
            }
          },
          showInLegend: false,
          innerSize: '40%'
        }
      },
      series: [{
        type: 'pie',
        name: 'Energy Sources',
        data: [
          {
            name: 'Solar',
            y: 300,
            color: '#ffc107'
          },
          {
            name: 'Hydro',
            y: 450,
            color: '#2196f3'
          },
          {
            name: 'Wind',
            y: 200,
            color: '#26a69a'
          }
        ]
      }]
    };

    this.chart = Highcharts.chart(this.chartContainer.nativeElement, chartOptions);
  }

  viewFullDashboard(): void {
    // Placeholder for full dashboard navigation
    console.log('Navigate to full Celeste dashboard');
    alert('This would navigate to the full Celeste renewable energy dashboard with comprehensive analytics and real-time monitoring.');
  }

  viewSkills(): void {
    // Navigate to skills section and highlight relevant technologies
    const celesteSkills = ['Angular', 'TypeScript', 'RxJS', 'Highcharts', 'Azure'];

    // Close modal first
    this.dialogRef.close();

    // Navigate to skills with the first relevant skill highlighted
    this.skillsNavigationService.navigateToSkill(celesteSkills[0], '/projects');

    // Highlight additional skills with delay
    celesteSkills.slice(1).forEach((skill, index) => {
      setTimeout(() => {
        this.skillsNavigationService.navigateToSkill(skill, '/about');
      }, (index + 1) * 1000);
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}

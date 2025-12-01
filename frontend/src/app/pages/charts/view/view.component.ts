import { Component, OnInit } from '@angular/core';
import { ChartsService } from 'src/app/services/charts.service';
import { globalChartOptions, colors } from 'src/app/variables/charts';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  barCharts: any[] = [];
  doughnutCharts: any[] = [];
  lineCharts: any[] = [];

  constructor(private chartsService: ChartsService) { }

  ngOnInit(): void {
    this.loadCharts();
  }

  private createBarTemplate() {
    return {
      data: { labels: [], datasets: [{ label: '', data: [], backgroundColor: colors.theme.warning, borderRadius: 6 }] },
      options: { ...globalChartOptions, plugins: { ...globalChartOptions.plugins, title: { display: true, text: '' } }, height: 250 }
    };
  }

  private createDoughnutTemplate() {
    return {
      data: { labels: [], datasets: [{ label: '', data: [], backgroundColor: [colors.theme.primary, colors.theme.warning, colors.theme.success, colors.theme.danger] }] },
      options: { ...globalChartOptions, plugins: { ...globalChartOptions.plugins, title: { display: true, text: '' } }, height: 180 }
    };
  }

  private createLineTemplate() {
    return {
      data: { labels: [], datasets: [{ label: '', data: [], borderColor: colors.theme.primary, backgroundColor: 'transparent', tension: 0.4, pointRadius: 4 }] },
      options: { ...globalChartOptions, plugins: { ...globalChartOptions.plugins, title: { display: true, text: '' } }, height: 200 }
    };
  }

  loadCharts() {
    // 3 gráficos de barras
    ['ventas-diarias', 'ingresos-semanales', 'pedidos-mensuales'].forEach(chartName => {
      this.chartsService.getBarras(chartName).subscribe(res => {
        const chart = this.createBarTemplate();
        chart.data.labels = res.labels;
        chart.data.datasets[0].data = res.data;
        chart.data.datasets[0].label = res.title;
        chart.options.plugins.title.text = res.title;
        this.barCharts.push(chart);
      });
    });

    // 3 gráficos circulares
    ['ventas-tipo-comida', 'repartidores-ocupados', 'usuarios-activos'].forEach(chartName => {
      this.chartsService.getCircular(chartName).subscribe(res => {
        const chart = this.createDoughnutTemplate();
        chart.data.labels = res.labels;
        chart.data.datasets[0].data = res.data;
        chart.data.datasets[0].label = res.title;
        chart.options.plugins.title.text = res.title;
        this.doughnutCharts.push(chart);
      });
    });

    // 3 gráficos de series temporales
    ['ventas-hora', 'ingresos-semanales', 'pedidos-mensuales'].forEach(chartName => {
      this.chartsService.getSeries(chartName).subscribe(res => {
        const chart = this.createLineTemplate();
        chart.data.labels = res.labels;
        chart.data.datasets[0].data = res.data;
        chart.data.datasets[0].label = res.title;
        chart.options.plugins.title.text = res.title;
        this.lineCharts.push(chart);
      });
    });
  }
}

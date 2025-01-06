import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Qualità della vita';
  indicators: any;
  data: any;
  cities: any;
  selectedIndicator: any;
  selectedCities: any;
  chart!: Chart;
  colorMap: { [city: string]: string } = {};

  constructor(private http: HttpClient){
  }

  ngOnInit(){
    this.selectedCities = ["Milano", "Roma", "Trieste", "Reggio Calabria"];
    this.fetchData();
  }

  fetchData(): void {
    this.http.get('db/2024.json').subscribe((data: any) => {
      this.data = data;

      this.indicators = data['Torino'].indicatori.map((indicatore: any) => ({
        name: indicatore.nome,
        description: indicatore.unita_di_misura,
      }));

      this.cities = Object.keys(data).map((city, index) => ({
        id: index + 1,
        name: data[city].denominazione
      }));

      this.selectedIndicator = "Canoni medi di locazione";
      this.initializeChart();
      this.onIndicatorChange();
    });
  }

  initializeChart(): void {
    const ctx = document.getElementById('chart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.selectedCities,
        datasets: [
          {
            label: this.selectedIndicator,
            data: [],
            borderWidth: 1,
            backgroundColor: [],
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  onIndicatorChange(): void {
    const labels: string[] = [];
    const values: number[] = [];
    const colors: string[] = [];
    const cities = this.selectedCities && this.selectedCities.length > 0 ? this.selectedCities : Object.keys(this.data);

    for (let city of cities) {
      if (this.data.hasOwnProperty(city) ) {
        const indicator = this.data[city].indicatori.find(
          (ind: any) => ind.nome === this.selectedIndicator
        );

        if (indicator) {
          labels.push(this.data[city].denominazione);
          values.push(indicator.valore);
          
          if (!this.colorMap[city]) {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            this.colorMap[city] = `rgba(${r}, ${g}, ${b}, 0.4)`;
          }
      
          colors.push(this.colorMap[city]);
        }
      }
    }

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].label = this.selectedIndicator;
    this.chart.data.datasets[0].data = values;
    this.chart.data.datasets[0].backgroundColor = colors;
    this.chart.update();
  }

  onCityChange(): void {
    this.onIndicatorChange();
  }
  
}

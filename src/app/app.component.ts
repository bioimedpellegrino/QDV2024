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
  selectedCity: any;
  selectedCities: any;
  chart!: Chart;
  colorMap: { [city: string]: string } = {};

  constructor(private http: HttpClient){

  }

  ngOnInit(){
    this.fetchData();
    this.initializeChart();
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

      this.selectedIndicator = this.indicators[0];
      this.onIndicatorChange();

    });
  }

  initializeChart(): void {
    const ctx = document.getElementById('chart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        datasets: [
          {
            label: this.selectedIndicator,
            data: [12, 19, 3, 5, 2, 3, 8, 9, 10, 11],
            borderWidth: 1,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
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

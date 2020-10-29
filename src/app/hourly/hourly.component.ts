import { Component, OnInit } from '@angular/core';
import {HomeComponent} from '../home/home.component';

@Component({
  selector: 'app-hourly',
  templateUrl: './hourly.component.html',
  styleUrls: ['./hourly.component.css']
})
export class HourlyComponent implements OnInit {
  ChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: {
      onClick: (e) => e.stopPropagation(),
      labels: {
        fontFamily: 'sans-serif',
        fontSize: 14
      }
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: '',
          fontFamily: 'sans-serif',
          fontSize: 15
        },
        ticks: {
          fontFamily: 'sans-serif',
          fontSize: 14,
          suggestedMin: 0,
          suggestedMax: 0,
          precision: 0
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Time difference from current hour',
          fontFamily: 'sans-serif',
          fontSize: 15
        },
        ticks: {
          fontFamily: 'sans-serif',
          fontSize: 14
        }
      }],
    }
  };
  ChartLabels = [];
  ChartType = 'bar';
  ChartLegend = true;
  ChartData = [
    {
      data: [],
      label: '',
      backgroundColor: '#92CBF1',
      borderColor: '#92CBF1',
      hoverBackgroundColor: '#5D87A5',
      hoverBorderColor: '#5D87A5'
    }
  ];
  optionsHourly = ['Pressure', 'Humidity', 'Ozone', 'Visibility', 'Wind Speed'];
  constructor(public home: HomeComponent) { }

  ngOnInit() {
    this.getTemperature();
  }
  getTemperature() {
    for (let i = 0; i < 24; i++) {
      this.ChartLabels[i] = i;
      this.ChartData[0].data[i] = Math.round(this.home.weatherData.hourly.data[i].temperature);
    }
    const tempArr = this.ChartData[0].data;
    this.ChartData[0].label = 'temperature';
    this.ChartOptions.scales.yAxes[0].scaleLabel.labelString = 'Fahrenheit';
    // this.ChartOptions.scales.yAxes[0].ticks.stepSize = 2;
    this.ChartOptions.scales.yAxes[0].ticks.suggestedMin = Math.min.apply(Math, tempArr) - 6;
    this.ChartOptions.scales.yAxes[0].ticks.suggestedMax = Math.max.apply(Math, tempArr) + 3;
  }
  getPressure() {
    for (let i = 0; i < 24; i++) {
      this.ChartLabels[i] = i;
      this.ChartData[0].data[i] = this.home.weatherData.hourly.data[i].pressure.toFixed(2);
    }
    const tempArr = this.ChartData[0].data;
    this.ChartData[0].label = 'pressure';
    this.ChartOptions.scales.yAxes[0].scaleLabel.labelString = 'Millibars';
    // this.ChartOptions.scales.yAxes[0].ticks.stepSize = 2;
    this.ChartOptions.scales.yAxes[0].ticks.suggestedMin = Math.min.apply(Math, tempArr) - 4;
    this.ChartOptions.scales.yAxes[0].ticks.suggestedMax = Math.max.apply(Math, tempArr) + 3;
  }
  getHumidity() {
    for (let i = 0; i < 24; i++) {
      this.ChartLabels[i] = i;
      this.ChartData[0].data[i] = Math.round(this.home.weatherData.hourly.data[i].humidity * 100);
    }
    const tempArr = this.ChartData[0].data;
    this.ChartData[0].label = 'humidity';
    this.ChartOptions.scales.yAxes[0].scaleLabel.labelString = '% Humidity';
    // this.ChartOptions.scales.yAxes[0].ticks.stepSize = 5;
    this.ChartOptions.scales.yAxes[0].ticks.suggestedMin = Math.min.apply(Math, tempArr) - 5;
    this.ChartOptions.scales.yAxes[0].ticks.suggestedMax = Math.max.apply(Math, tempArr) + 5;
  }
  getOzone() {
    for (let i = 0; i < 24; i++) {
      this.ChartLabels[i] = i;
      this.ChartData[0].data[i] = this.home.weatherData.hourly.data[i].ozone.toFixed(2);
    }
    const tempArr = this.ChartData[0].data;
    this.ChartData[0].label = 'ozone';
    this.ChartOptions.scales.yAxes[0].scaleLabel.labelString = 'Dobson Units';
    // this.ChartOptions.scales.yAxes[0].ticks.stepSize = 5;
    this.ChartOptions.scales.yAxes[0].ticks.suggestedMin = Math.min.apply(Math, tempArr) - 5;
    this.ChartOptions.scales.yAxes[0].ticks.suggestedMax = Math.max.apply(Math, tempArr) + 3;
  }
  getVisibility() {
    for (let i = 0; i < 24; i++) {
      this.ChartLabels[i] = i;
      this.ChartData[0].data[i] = this.home.weatherData.hourly.data[i].visibility.toFixed(2);
    }
    const tempArr = this.ChartData[0].data;
    this.ChartData[0].label = 'visibility';
    this.ChartOptions.scales.yAxes[0].scaleLabel.labelString = 'Miles (Maximum 10)';
    // this.ChartOptions.scales.yAxes[0].ticks.stepSize = 1;
    this.ChartOptions.scales.yAxes[0].ticks.suggestedMin = Math.min.apply(Math, tempArr) - 1;
    this.ChartOptions.scales.yAxes[0].ticks.suggestedMax = Math.max.apply(Math, tempArr) + 2;
  }
  getWindSpeed() {
    for (let i = 0; i < 24; i++) {
      this.ChartLabels[i] = i;
      this.ChartData[0].data[i] = this.home.weatherData.hourly.data[i].windSpeed.toFixed(2);
    }
    const tempArr = this.ChartData[0].data;
    this.ChartData[0].label = 'Wind Speed';
    this.ChartOptions.scales.yAxes[0].scaleLabel.labelString = 'Miles per Hour';
    // this.ChartOptions.scales.yAxes[0].ticks.stepSize = 1;
    this.ChartOptions.scales.yAxes[0].ticks.suggestedMin = 0;
    this.ChartOptions.scales.yAxes[0].ticks.suggestedMax = Math.max.apply(Math, tempArr) + 2;
  }
  switch(value) {
    console.log('test');
    if (value === 'Temperature') {
      this.getTemperature();
    }
    if (value === 'Pressure') {
      this.getPressure();
    }
    if (value === 'Humidity') {
      this.getHumidity();
    }
    if (value === 'Ozone') {
      this.getOzone();
    }
    if (value === 'Visibility') {
      this.getVisibility();
    }
    if (value === 'Wind Speed') {
      this.getWindSpeed();
    }
  }
}

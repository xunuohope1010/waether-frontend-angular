import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {DataService} from '../data.service';
import * as CanvasJS from '../../assets/canvasjs.min';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('myResult', {static: false}) myResult: ElementRef;
  @ViewChild('myModalButton', {static: false}) myModalButton: ElementRef;
  showResult = false;
  weatherData: any;
  city: string;
  str = 'star_border';
  state: string;
  street: string;
  i: number;
  options = [];
  // showTable = true;
  showProgress = false;
  hasRecords = false;
  validAddress = true;
  lat: number;
  lng: number;
  points = [];
  chartOptions = {};

  dateStr: string;
  temperature: number;
  summary: string;
  iconLink: string;
  precipitation: any;
  chanceOfRain: any;
  windSpeed: any;
  humidity: any;
  visibility: any;
  localTimezone: string;
  targetTimezone: string;
  timeSwitch = false;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    // localStorage.clear();
    if (localStorage.getItem('PSKR1GC')) {
      this.options = JSON.parse(localStorage.getItem('PSKR1GC'));
      if (this.options.length !== 0) {
        this.hasRecords = true;
        this.options = JSON.parse(localStorage.getItem('PSKR1GC'));
      }
    }
  }

  draw() {
    const chart = new CanvasJS.Chart('chartContainer', this.chartOptions);
    setTimeout(() => {
      chart.render();
    }, 200);
  }

  load() {
    let timeDiff = 0;
    if (this.timeSwitch) {
      const target = new Date().toLocaleString('en-US', {timeZone: this.targetTimezone});
      // console.log('target:' + target);
      const targetZone = new Date(target).getTime();
      const local = new Date().toLocaleString('en-US', {timeZone: this.localTimezone});
      // console.log('local:' + local);
      const localZone = new Date(local).getTime();
      timeDiff = targetZone - localZone;
      // console.log(timeDiff);
    }
    for (let i = 0; i < 8; i++) {
      let dateObj = new Date();
      if (this.timeSwitch) {
        dateObj = new Date(this.weatherData.daily.data[i].time * 1000 + timeDiff);
        // console.log('time change');
      } else {
        dateObj = new Date(this.weatherData.daily.data[i].time * 1000);
        // console.log('time not change');
      }
      const pointX = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
      // tslint:disable-next-line:max-line-length
      const pointY = [Math.round(this.weatherData.daily.data[i].temperatureLow), Math.round(this.weatherData.daily.data[i].temperatureHigh)];
      const labelY = dateObj.getDate() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getFullYear();
      const timeY = this.weatherData.daily.data[i].time;
      this.points[i] = {
        x: pointX, y: pointY, label: labelY, time: timeY
      };
    }
    this.chartOptions = {
      animationEnabled: true,
      exportEnabled: false,
      title: {
        text: 'Weekly Weather'
      },
      dataPointWidth: 15,
      axisX: {
        title: 'Days',
        reversed: true,
        labelFontSize: 14,
        // fontFamily: 'sans-serif'
      },
      axisY: {
        includeZero: false,
        title: 'Temperature in Fahrenheit',
        interval: 10,
        gridThickness: 0,
        labelFontSize: 14,
        // fontFamily: 'sans-serif'
      },
      legend: {
        horizontalAlign: 'center', // left, center ,right
        verticalAlign: 'top',  // top, center, bottom
      },
      toolTip: {
        fontSize: 14,
        // fontFamily: 'sans-serif',
        content: '<b>{label}</b>: {y[0]} to {y[1]}'
      },
      data: [{
        color: '#92CBF1',
        type: 'rangeBar',
        showInLegend: true,
        indexLabel: '{y[#index]}',
        indexLabelFontSize: 14,
        // indexLabelFontFamily: 'sans-serif',
        legendText: 'Day wise temperature range',
        dataPoints: this.points,
        // toolTipContent: '<b>{label}</b>: {y[0]} to {y[1]}',
        click: e => {
          // console.log(e.dataPoint.time);
          // localStorage.setItem('myData', e.dataPoint.time);
          const param = {time: e.dataPoint.time, lat: this.weatherData.latitude, lng: this.weatherData.longitude};
          this.getData(param);
          // document.getElementById('openModalButton').click();
        },
      }]
    };
  }

  submit(value, temp = 0) {
    // document.getElementById('results').click();
    this.showProgress = true;
    this.myResult.nativeElement.click();
    this.showResult = false;
    this.validAddress = true;
    this.str = 'star_border';
    this.city = value.city;
    this.state = value.state;
    if (temp === -1 || (temp === 1 && !value.street && value.lat && value.lng)) {
      this.dataService.sendLocation(value).subscribe((data: any) => {
        console.log(data);
        this.weatherData = data;
        this.lat = value.lat;
        this.lng = value.lng;
        this.timeSwitch = false;
        this.load();
        this.showProgress = false;
        this.showResult = true;
        if (localStorage.getItem('PSKR1GC')) {
          const records = JSON.parse(localStorage.getItem('PSKR1GC'));
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < records.length; i++) {
            if (this.city === records[i].city && this.state === records[i].state) {
              this.str = 'star';
              break;
            }
          }
        }
      });
      return;
    }
    this.street = value.street;
    this.dataService.sendSearchRequest(value).subscribe((data2: any) => {
      console.log(data2);
      if (data2.status === 'ZERO_RESULTS') {
        this.validAddress = false;
        this.showProgress = false;
        return;
      }
      // this.showProgress = true;
      const param = {lat: data2.results[0].geometry.location.lat, lng: data2.results[0].geometry.location.lng, state: value.state};
      console.log(param);
      this.dataService.sendLocation(param).subscribe((data: any) => {
        this.weatherData = data;
        this.targetTimezone = data.timezone;
        this.timeSwitch = true;
        this.load();
        this.showProgress = false;
        this.showResult = true;
        if (localStorage.getItem('PSKR1GC')) {
          const records = JSON.parse(localStorage.getItem('PSKR1GC'));
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < records.length; i++) {
            if (this.city === records[i].city && this.state === records[i].state) {
              this.str = 'star';
              break;
            }
          }
        }
      });

    });
  }

  add() {
    if (this.str === 'star_border') {
      this.str = 'star';
      if (localStorage.getItem('PSKR1GC')) {
        this.options = JSON.parse(localStorage.getItem('PSKR1GC'));
        if (this.options.length === 0) {
          // tslint:disable-next-line:max-line-length
          this.options.push({
            img: this.weatherData.imgLink,
            city: this.city,
            state: this.state,
            street: this.street,
            lat: this.lat,
            lng: this.lng
          });
          this.hasRecords = true;
          localStorage.setItem('PSKR1GC', JSON.stringify(this.options));
        } else {
          let push = true;
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.options.length; i++) {
            if (this.city === this.options[i].city && this.state === this.options[i].state) {
              push = false;
              break;
            }
          }
          if (push) {
            // tslint:disable-next-line:max-line-length
            this.options.push({
              img: this.weatherData.imgLink,
              city: this.city,
              state: this.state,
              street: this.street,
              lat: this.lat,
              lng: this.lng
            });
            localStorage.setItem('PSKR1GC', JSON.stringify(this.options));
          }
        }

      } else {
        // tslint:disable-next-line:max-line-length
        this.options.push({
          img: this.weatherData.imgLink,
          city: this.city,
          state: this.state,
          street: this.street,
          lat: this.lat,
          lng: this.lng
        });
        this.hasRecords = true;
        localStorage.setItem('PSKR1GC', JSON.stringify(this.options));
      }

    } else {
      this.str = 'star_border';
      this.options = JSON.parse(localStorage.getItem('PSKR1GC'));
      //
      const temp = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.options.length; i++) {
        if (this.city !== this.options[i].city && this.state !== this.options[i].state) {
          temp.push(this.options[i]);
        }
      }
      this.options = temp;
      //
      if (this.options.length === 0) {
        this.hasRecords = false;
      }
      localStorage.setItem('PSKR1GC', JSON.stringify(this.options));
    }
  }

  delete(option) {
    this.options = JSON.parse(localStorage.getItem('PSKR1GC'));
    // console.log(option);
    const temp = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.options.length; i++) {
      if (option.city !== this.options[i].city && option.state !== this.options[i].state) {
        temp.push(this.options[i]);
      }
    }
    this.options = temp;
    // this.options.splice(this.options.indexOf(option), 1);
    localStorage.setItem('PSKR1GC', JSON.stringify(this.options));
    if (this.city === option.city && this.state === option.state) {
      this.str = 'star_border';
    }
    if (this.options.length === 0) {
      this.hasRecords = false;
    }
  }

  // restore() {
  //   this.showTable = true;
  // }

  twitter() {
    // tslint:disable-next-line:max-line-length
    const str = 'The current temperature at ' + this.city + ' is ' + this.weatherData.currently.temperature.toFixed(2) + '°F. The weather conditions are ' + this.weatherData.currently.summary + '.%0A%23CSCI571WeatherSearch';
    window.open('https://twitter.com/intent/tweet?text=' + str, '_blank');
  }

  clear() {
    // document.getElementById('results').click();
    this.myResult.nativeElement.click();
  }

  getData(param) {
    // const timeX = localStorage.getItem('myData');
    // const param = {time: timeX, lat: this.home.weatherData.latitude, lng: this.home.weatherData.longitude};
    let timeDiff = 0;
    if (this.timeSwitch) {
      const target = new Date().toLocaleString('en-US', {timeZone: this.targetTimezone});
      // console.log('target:' + this.targetTimezone);
      const targetZone = new Date(target).getTime();
      const local = new Date().toLocaleString('en-US', {timeZone: this.localTimezone});
      // console.log('local:' + this.localTimezone);
      const localZone = new Date(local).getTime();
      timeDiff = targetZone - localZone;
      // console.log(timeDiff);
    }
    this.dataService.sendTimeRequest(param).subscribe((dataDetail: any) => {
      // console.log(dataDetail);
      let dateObj = new Date();
      if (this.timeSwitch) {
        dateObj = new Date(dataDetail.daily.data[0].time * 1000 + timeDiff);
        // console.log('time change modal');
      } else {
        dateObj = new Date(dataDetail.daily.data[0].time * 1000);
        // console.log('time not change modal');
      }
      this.dateStr = dateObj.getDate() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getFullYear();
      // this.city = param.city;
      this.temperature = Math.round(dataDetail.currently.temperature);
      this.summary = dataDetail.currently.summary;
      const icon = dataDetail.currently.icon;
      if (icon === 'clear-day' || icon === 'clear-night') {
        this.iconLink = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png';
      }
      if (icon === 'rain') {
        this.iconLink = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png';
      }
      if (icon === 'snow') {
        this.iconLink = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png';
      }
      if (icon === 'sleet') {
        this.iconLink = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png';
      }
      if (icon === 'wind') {
        this.iconLink = 'https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png';
      }
      if (icon === 'fog') {
        this.iconLink = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png';
      }
      if (icon === 'cloudy') {
        this.iconLink = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png';
      }
      if (icon === 'partly-cloudy-day' || icon === 'partly-cloudy-night') {
        this.iconLink = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png';
      }
      this.precipitation = dataDetail.currently.precipIntensity;
      if (this.precipitation === '') {
        this.precipitation = 'N/A';
      } else {
        if (this.precipitation.toFixed(2) >= 0.01) {
          this.precipitation = this.precipitation.toFixed(2);
        } else {
          this.precipitation = 0;
        }
      }
      this.chanceOfRain = dataDetail.currently.precipProbability;
      if (this.chanceOfRain === '') {
        this.chanceOfRain = 'N/A';
      } else {
        this.chanceOfRain = Math.round(this.chanceOfRain * 100);
      }
      this.windSpeed = dataDetail.currently.windSpeed;
      if (this.windSpeed === '') {
        this.windSpeed = 'N/A';
      } else {
        if (this.windSpeed.toFixed(2) >= 0.01) {
          this.windSpeed = this.windSpeed.toFixed(2);
        } else {
          this.windSpeed = 0;
        }
      }
      this.humidity = dataDetail.currently.humidity;
      if (this.humidity === '') {
        this.humidity = 'N/A';
      } else {
        this.humidity = Math.round(this.humidity * 100);
      }
      this.visibility = dataDetail.currently.visibility;
      if (this.visibility === '') {
        this.visibility = 'N/A';
      } else {
        if (this.visibility.toFixed(2) >= 0.01) {
          this.visibility = this.visibility.toFixed(2);
        } else {
          this.visibility = 0;
        }
      }
      // document.getElementById('openModalButton').click();
      this.myModalButton.nativeElement.click();
    });
  }
}

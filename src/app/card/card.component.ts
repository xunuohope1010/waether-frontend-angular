import { Component, OnInit } from '@angular/core';
import {HomeComponent} from '../home/home.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  timezone: string;
  city: string;
  temperature: number;
  summary: string;
  humidity: number;
  pressure: number;
  windSpeed: number;
  visibility: number;
  cloudCover: number;
  ozone: number;
  imgLink: string;
  constructor(public home: HomeComponent) { }

  ngOnInit() {
    this.timezone = this.home.weatherData.timezone;
    this.city = this.home.city;
    this.temperature = Math.round(this.home.weatherData.currently.temperature);
    this.summary = this.home.weatherData.currently.summary;
    this.humidity = this.home.weatherData.currently.humidity;
    this.pressure = this.home.weatherData.currently.pressure;
    this.windSpeed = this.home.weatherData.currently.windSpeed;
    this.visibility = this.home.weatherData.currently.visibility;
    this.cloudCover = this.home.weatherData.currently.cloudCover;
    this.ozone = this.home.weatherData.currently.ozone;
    this.imgLink = this.home.weatherData.imgLink;
  }

}

import {Component, OnInit} from '@angular/core';
import {HomeComponent} from '../home/home.component';
import {DataService} from '../data.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css']
})
export class BoxComponent implements OnInit {

  options = [];
  // tslint:disable-next-line:max-line-length
  stateText = '{ "States":[ { "Abbreviation":"AL", "State":"Alabama" }, { "Abbreviation":"AK", "State":"Alaska" }, { "Abbreviation":"AZ", "State":"Arizona" }, { "Abbreviation":"AR", "State":"Arkansas" }, { "Abbreviation":"CA", "State":"California" }, { "Abbreviation":"CO", "State":"Colorado" }, { "Abbreviation":"CT", "State":"Connecticut" }, { "Abbreviation":"DE", "State":"Delaware" }, { "Abbreviation":"DC", "State":"District Of Columbia" }, { "Abbreviation":"FL", "State":"Florida" }, { "Abbreviation":"GA", "State":"Georgia" }, { "Abbreviation":"HI", "State":"Hawaii" }, { "Abbreviation":"ID", "State":"Idaho" }, { "Abbreviation":"IL", "State":"Illinois" }, { "Abbreviation":"IN", "State":"Indiana" }, { "Abbreviation":"IA", "State":"Iowa" }, { "Abbreviation":"KS", "State":"Kansas" }, { "Abbreviation":"KY", "State":"Kentucky" }, { "Abbreviation":"LA", "State":"Louisiana" }, { "Abbreviation":"ME", "State":"Maine" }, { "Abbreviation":"MD", "State":"Maryland" }, { "Abbreviation":"MA", "State":"Massachusetts" }, { "Abbreviation":"MI", "State":"Michigan" }, { "Abbreviation":"MN", "State":"Minnesota" },{ "Abbreviation":"MS", "State":"Mississippi" },{ "Abbreviation":"MO", "State":"Missouri" },{ "Abbreviation":"MT", "State":"Montana" },{ "Abbreviation":"NE", "State":"Nebraska" },{ "Abbreviation":"NV", "State":"Nevada" },{ "Abbreviation":"NH", "State":"New Hampshire" },{ "Abbreviation":"NJ", "State":"New Jersey" },{ "Abbreviation":"NM", "State":"New Mexico" },{ "Abbreviation":"NY", "State":"New York" },{ "Abbreviation":"NC", "State":"North Carolina" },{ "Abbreviation":"ND", "State":"North Dakota" },{ "Abbreviation":"OH", "State":"Ohio" },{ "Abbreviation":"OK", "State":"Oklahoma" },{ "Abbreviation":"OR", "State":"Oregon" },{ "Abbreviation":"PA", "State":"Pennsylvania" },{ "Abbreviation":"RI", "State":"Rhode Island" },{ "Abbreviation":"SC", "State":"South Carolina" },{ "Abbreviation":"SD", "State":"South Dakota" },{ "Abbreviation":"TN", "State":"Tennessee" },{ "Abbreviation":"TX", "State":"Texas" },{ "Abbreviation":"UT", "State":"Utah" },{ "Abbreviation":"VT", "State":"Vermont" },{ "Abbreviation":"VA", "State":"Virginia" },{ "Abbreviation":"WA", "State":"Washington" },{ "Abbreviation":"WV", "State":"West Virginia" },{ "Abbreviation":"WI", "State":"Wisconsin" }, { "Abbreviation":"WY", "State":"Wyoming" } ] } ';
  stateOptions = JSON.parse(this.stateText).States;
  enableIP = false;
  angForm: FormGroup;
  constructor(private dataService: DataService, public home: HomeComponent, private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
  }
  createForm() {
    this.angForm = this.fb.group({
      street: ['', Validators.required ],
      city: ['', Validators.required ],
      state: ['', Validators.required ]
    });
  }
  sendRequest(value) {
    this.dataService.sendGetRequest(value).subscribe((data: any[]) => {
      console.log(data);
      this.options = data;
    });
  }

  submitForm() {
    // console.log(value.street + ' ' + value.city + ' ' + value.state);
    if (!this.enableIP) {
      this.dataService.sendIP().subscribe((data: any) => {
        this.home.localTimezone = data.timezone;
      });
      const param = {street: this.angForm.value.street, city: this.angForm.value.city, state: this.angForm.value.state};
      this.home.submit(param);
    } else {
      this.dataService.sendIP().subscribe((data: any) => {
        const param = {city: data.city, lat: data.lat, lng: data.lon, state: data.region};
        console.log(param);
        this.home.submit(param, -1);
      });
    }

  }

  clear() {
    // this.angForm.reset();
    this.angForm.reset({
      state: ''
    });
    this.home.showResult = false;
    this.enableIP = false;
    this.home.validAddress = true;
    this.angForm.controls.city.enable();
    this.angForm.controls.street.enable();
    this.angForm.controls.state.enable();
    this.home.clear();
  }

  location() {
    if (!this.enableIP) {
      // this.clear();
      this.enableIP = true;
      this.angForm.controls.city.disable();
      this.angForm.controls.street.disable();
      this.angForm.controls.state.disable();
    } else {
      this.enableIP = false;
      this.angForm.controls.city.enable();
      this.angForm.controls.street.enable();
      this.angForm.controls.state.enable();
    }

  }

}

import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

const data = {
  lamp1:{
    type: "Накаливания",
    price: 150,
    power: 25
  },
  lamp2:{
    type: "Диодная",
    price: 350,
    power: 4
  },
  rentPrice: 50,
  ipPrice: 50,
  cable: 30,
  colors:["Черный", "Белый"],
  ipType:["Обычная", "Уличная"],
  byType:["Покупка", "Аренда"]
};

declare global {
  interface Window { calc: any; }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})

export class AppComponent {
  title = 'garland-calculator';
  public calcCtr: FormGroup;
  public colors: string[];
  public ipTypes: string[];
  public types: string[];
  public byTypes: string[];

  ngOnInit() {
    this.calcCtr = new FormGroup({
      length      : new FormControl(10),
      step        : new FormControl(0.5),
      cableLength : new FormControl(1),
      type        : new FormControl("Накаливания"),
      color       : new FormControl("Черный"),
      ipType      : new FormControl("Обычная"),
      byType      : new FormControl("Покупка")
    });

    this.types = ["Накаливания","Диодная"];
    this.colors = data.colors;
    this.ipTypes = data.ipType;
    this.byTypes = data.byType;
    this.setValues();
    this.calcCtr.valueChanges.subscribe(value => {
      this.setValues();
    });
  }

  setValues(){
    let garland = this.calcCtr.value;
    this.calcCtr.value.numOfLamps = this.calcNumOfLamps(garland);
    this.calcCtr.value.price = this.calcPrice(this.calcCtr.value.numOfLamps, garland);
    window.calc = this.calcCtr.value;
  }

  calcNumOfLamps(garland):number {
    return Math.floor(garland.length / garland.step) + 1;
  }

  calcPower(garland, numOfLamps):number {
    switch (garland.type) {
      case "Накаливания":
        return numOfLamps * data.lamp1.power;
      case "Диодная":
        return numOfLamps * data.lamp2.power;
    }
  }

  getPriceOfLamp(garland):number{
    return (garland.type === "Накаливания") ? data.lamp1.price : data.lamp2.price
  }

  getIpPrice(garland):number{
    return garland.numOfLamps * data.ipPrice;
  }

  getCablePrice(garland):number{
    return ((garland.length + garland.cableLength) * data.cable)
  }

  calcPrice(numOfLamps, garland){
    switch (garland.byType) {
      case "Аренда":
        return numOfLamps * data.rentPrice;

      case "Покупка":

        switch (garland.ipType){

          case "Обычная":
            return (garland.length <= 11) ? Math.floor(numOfLamps * this.getPriceOfLamp(garland)) : Math.floor(numOfLamps * this.getPriceOfLamp(garland) + this.getCablePrice(garland));

          case "Уличная":
            return (garland.length <= 11) ? Math.floor(numOfLamps * this.getPriceOfLamp(garland)) + this.getIpPrice(garland) : Math.floor(numOfLamps * this.getPriceOfLamp(garland) + this.getCablePrice(garland)) + this.getIpPrice(garland);
        }
    }
  }

}


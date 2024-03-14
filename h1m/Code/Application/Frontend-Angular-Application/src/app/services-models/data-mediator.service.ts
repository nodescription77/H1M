import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataMediatorService {
  private sharedData: any;
  
  constructor() { }

  setData(data: any) {
    this.sharedData = data;
  }

  getData() {
    return this.sharedData;
  }
}

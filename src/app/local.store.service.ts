import {Injectable} from '@angular/core';

@Injectable()

export class LocalStoreService {

  constructor() {}

  set(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  get(key: string) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      console.error('Error getting data from localStorage', e);
    }
  }

  update(key: string, item: any) {
    const data = this.get(key);
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === item.id) {
        data[i] = item;
      }
    }
    this.set(key, data);
    console.log('Update');
  }

  delete(key: string, item: any) {
    const data = this.get(key);
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === item.id) {
        data.splice(i, 1);
      }
    }
    this.set(key, data);
  }

  create(key: string, item: any) {
    const data = this.get(key);
    data.push(item);
    this.set(key, data);
    }
}

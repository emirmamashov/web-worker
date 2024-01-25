import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Item } from 'src/app/models/item';

@Injectable({
  providedIn: 'root'
})
export class WebWorkerService {
  private worker: Worker | any;
  private itemSubject$ = new Subject<Item>();

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    this.worker = new Worker('/assets/app.worker.js', { type: 'module' });
    this.worker.onmessage = (data: Item) => {
      this.itemSubject$.next(data);
    };

    this.worker.onerror = (error: any) => {
      console.log('error', error);
    };
  }

  public sendMessage(item: Item) {
    this.worker.postMessage(item);
  }

  public getMessage(): Observable<Item> {
    return this.itemSubject$;
  }
}

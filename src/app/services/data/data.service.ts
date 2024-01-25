import { Injectable } from '@angular/core';
import { Observable, interval, map } from 'rxjs';
import { Item } from 'src/app/models/item';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public generateData(timer: number): Observable<Item> {
    return interval(timer).pipe(
      map((index) => {
        let item: Item = {
          id: index+1,
          int: 123,
          float: 123.123121231231231231234,
          color: 'red',
          child: {
            id: index+1,
            color: 'green'
          }
        }
        return item;
      })
    );
  }
}

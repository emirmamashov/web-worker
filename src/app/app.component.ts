import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Item } from './models/item';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { DataService, WebWorkerService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  public items: Array<Item> = [];
  public timer = 1000;
  public arraySize = 10;
  public additionalIds = '';

  private generateDataSubs = new Subscription();

  private destroyed$ = new Subject();

  constructor(
    private webWorkerService: WebWorkerService,
    private dataService: DataService,
    private _changeDetection: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.generateData(this.timer);
    this.getMessageAtWorker();
  }

  private generateData(timer: number): void {
    this.generateDataSubs.unsubscribe();
    this.generateDataSubs = this.dataService.generateData(timer).subscribe((data: Item) => {
      this.webWorkerService.sendMessage(data);
    });
  }

  private getMessageAtWorker(): void {
    this.webWorkerService.getMessage().pipe(
      takeUntil(this.destroyed$)
    ).subscribe((data: any) => {
      this.items.push(data.data);
      if (this.items.length > this.arraySize) {
        this.items.shift();
      }
      this.setAdditionallyIds(this.items);
      this._changeDetection.detectChanges();
    });
  }

  private setAdditionallyIds(items: Array<Item>): void {
    if (!this.additionalIds.length) {
      return;
    }

    const ids = this.additionalIds.split(',');
    for(let i=0; i<=ids.length; i++) {
      if (!ids[i]) {
        continue;
      }

      items[i].id = +ids[i];
    }
  }

  public changeTimer(value: any): void {
    this.generateData(value);
  }

  public changeArraySize(value: any): void {
    this.arraySize = value;
    this._changeDetection.detectChanges();
  }

  public changeAdditionallyArrayIds(value: any): void {
    this.additionalIds = value;
    this._changeDetection.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    '(document:click)': 'onCloseCalendar($event)'
  }})


export class DatepickerComponent implements OnInit {
  date: Date = new Date();
  month: number;
  year: number;
  days: number[];

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

  showCalendar = false;
  result: string;

  @Input() label = 'Date';
  @Input() value: string;
  @Output() update: EventEmitter<string> = new EventEmitter<string>();
   $event: Event;

  range(j, k) {
    return Array
      .apply(null, Array((k - j) + 1))
      .map((_, n) =>  n + j);
  }
  updateMonth(e?: Event, type?: string) {
    if (e) {
      e.stopPropagation();
    }
    if (type === 'dec') {
      this.month--;
    }
    if (type === 'inc') {
      this.month++;
    }
    if (this.month < 0) {
      this.month = 11;
      this.year--;
    }
    if (this.month > 11) {
      this.month = 0;
      this.year++;
    }
    const date = new Date(this.year, this.month, 0);
    const days = date.getDate();
    const day = date.getDay();
    const prefix = new Array(day);

    this.days = prefix.concat(this.range(1, days));
  }

  selectDay(day: number) {
    if (!day) {
      return;
    }
    const pad = s => s.length < 2 ? 0 + s : s;
    this.date = new Date(this.year, this.month, day);
    this.result = `${pad(day + '')}${pad(this.month + 1 + '')}${this.year}`;
    this.update.emit(this.result);
  }

  onShowCalendar(e: Event) {
    e.stopPropagation();
    this.showCalendar = true;
  }

  onCloseCalendar(e: Event) {
    if (this.showCalendar) {
      this.showCalendar = false;
      this.update.emit(this.result);
    }
    return;
  }

  ngOnInit() {
    if (this.value) {
      this.date = new Date(this.value);
    }
    this.month = this.date.getMonth();
    this.year = this.date.getFullYear();
    if (this.value) {
      this.selectDay(this.date.getDate());
    }
    this.updateMonth();
  }
}

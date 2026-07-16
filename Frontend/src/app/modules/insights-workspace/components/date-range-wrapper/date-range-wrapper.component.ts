import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { DateRange, DefaultMatCalendarRangeStrategy, MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { CalendarComponent } from '@niceltd/sol/calendar';
import { TranslationService } from '@niceltd/sol/translation';

@Component({
  selector: 'app-date-range-wrapper',
  template: `
<div id="date-range-container" class="date-range-picker-wrapper" (click)="childClick($event)">
   <div class="date-range-container">
      <div class="list-container">
         <div class="list-sub-container">
            <sol-button [variant]="'tertiary'" class="list-elements" (buttonClick)="changeDays(1)"
               [ariaLabel]="yesterday"><span class="span-width">{{ 'insightsWorkspace.dropdownLabels.yesterday' | translate }}</span></sol-button>
            <sol-button [variant]="'tertiary'" class="list-elements" (buttonClick)="changeDays(7)"
               [ariaLabel]="lastSevenDays "><span class="span-width">{{ 'insightsWorkspace.dropdownLabels.lastSevenDays' | translate }}</span></sol-button>
            <sol-button [variant]="'tertiary'" class="list-elements" (buttonClick)="changeDays(14)"
               [ariaLabel]="lastFourteenDays"><span class="span-width">{{ 'insightsWorkspace.dropdownLabels.lastFourteenDays' | translate }}</span></sol-button>
            <sol-button [variant]="'tertiary'" class="list-elements" (buttonClick)="changeDays(30)"
               [ariaLabel]="lastThirtyDays"><span class="span-width">{{ 'insightsWorkspace.dropdownLabels.lastThirtyDays' | translate }}</span></sol-button>
         </div>
      </div>
      <div class="sol-calender-wrapper">
         <sol-calendar #calendar [type]="'range-selection'"
            [(ngModel)]="selectedDateRange"
            (dateSelected)="dateSelection($event)"
               [min]="minDate"
               [max]="maxDate">
         </sol-calendar>
      </div>
   </div>
</div>
  `,
  styleUrl: './date-range-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DateRangeWrapperComponent,
      multi: true
    },
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useFactory: (component: DateRangeWrapperComponent) =>
        new DefaultMatCalendarRangeStrategy(component._dateAdapter),
      deps: [DateRangeWrapperComponent]
    }
  ]
})

export class DateRangeWrapperComponent implements OnInit {

  @Input() min : Date;
  @Input() max: Date;
  @Input() daysDisabled: number[] = [];

  @Output() closed = new EventEmitter<void | 'clear' | 'cancel'>();
  @Output() dateSelected = new EventEmitter<DateRange<Date | null>>();
  @Output() listSelected = new EventEmitter<number>();
  @Output() selectedMonth = new EventEmitter<number>();
  @Output() timeRangeEvent = new EventEmitter<boolean>();
  @ViewChild('calendar', { static: true }) calendarRef!: CalendarComponent;

  minDate: Date | null;
  maxDate: Date | null;
  selectedDateRange: DateRange<Date | null> = new DateRange(null, null);
  selectedStartDateTime!: Date | null;
  selectedEndDateTime!: Date | null;
  switchTabIndex = 0;
  dateSingleSelectionState = true;
  _currentDateRange!: DateRange<Date | null>;
  _previousDateRange!: DateRange<Date | null>;
  lastSevenDays = this.translationService.getTranslation('lastSevenDays');
  yesterday = this.translationService.getTranslation('yesterday');
  lastThirtyDays = this.translationService.getTranslation('lastMonth');
  lastFourteenDays = this.translationService.getTranslation('lastFourteenDays');

  constructor(private translationService: TranslationService, public _dateAdapter: DateAdapter<Date>) {
    const currentDate = new Date();
    this.minDate = new Date(currentDate);
    this.maxDate = new Date(currentDate);
    this.maxDate.setDate(currentDate.getDate() - 1);
    this.minDate.setDate(currentDate.getDate() - 90); // Date three months(90 days) ago
  }

  ngOnInit(): void {
    this.selectedDateRange = new DateRange(this.min, this.max);
  }

  _controlValueAccessorChangeFn = (_: DateRange<Date | null>) => {};

  _controlValueAccessorTouchedFn: () => void = () => {};

  registerOnChange(fn: () => any): void {
    this._controlValueAccessorChangeFn = fn;
  }
  registerOnTouched(fn: any): void {
    this._controlValueAccessorTouchedFn = fn;
  }

  compareDatesIgnoringTime(date1: Date, date2: Date): boolean {
    const normalizedDate1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const normalizedDate2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return normalizedDate1.getTime() === normalizedDate2.getTime();
  }

  dateSelection(date: any) : void {
    this._controlValueAccessorChangeFn(date);
    if (this.selectedDateRange.end && this.selectedDateRange.start) {
      const areDatesEqual : boolean = this.compareDatesIgnoringTime(this.selectedDateRange.start, this.selectedDateRange.end);
      if (!areDatesEqual) {
        this._previousDateRange = date;
        this.dateSelected.emit(date);
        this.closed.emit();
      }
    }
  }

  changeDays(value: number) : void {
    this.listSelected.emit(value);
    this.closed.emit();
  }

  changeMonth(value: number) : void {
    this.selectedMonth.emit(value);
    this.closed.emit();
  }

  childClick(event: any) : void {
    event.stopPropagation();
  }

}
